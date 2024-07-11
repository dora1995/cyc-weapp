import React, { useCallback, useEffect, useState } from "react";
import { View } from "@remax/one";
import { useAlert } from "../Modal";
import geocoder from "@/api/geocoder";
import s from "./index.scss";

type LocationCtx = null | {
  latitude: number;
  longitude: number;
  province: string;
  city: string;
  district: string;
  street: string;
  street_number: string;
};

export default (props: {
  deny: () => JSX.Element;
  loaded: (locationCtx: LocationCtx) => JSX.Element;
  loading: () => JSX.Element;
  failure: (err: any) => JSX.Element;
}): [
  JSX.Element,
  {
    locationCtx: LocationCtx;
    failure: null | Error;
    loaded: boolean;
    isLoading: boolean;
    isDeny: boolean;
  }
] => {
  const [locationCtx, setLocationCtx] = useState<LocationCtx>(null);
  const [locations, setLocations] = useState<null | {
    latitude: number;
    longitude: number;
  }>(null);

  const [failure, setFailure] = useState<Error | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeny, setIsDeny] = useState(false);

  const [alertNode, alert] = useAlert();

  const authSettingProcess = useCallback(
    (authSetting: WechatMiniprogram.AuthSetting) => {
      setIsLoading(true);
      if (!("scope.userLocation" in authSetting)) {
        // 第一次提起授权
      } else if (authSetting["scope.userLocation"] === false) {
        // 明确拒绝授权了
        setIsDeny(true);
        setIsLoading(false);
        return;
      }
      // 允许授权了
      setIsDeny(false);
      wx.getLocation({
        type: "gcj02",
        success(res) {
          setLocations(res);
        },
        fail(err) {
          if (/deny|denied/.test(err.errMsg)) {
            setIsDeny(true);
          } else {
            setFailure(new Error(err.errMsg));
          }
        },
        complete() {
          setIsLoading(false);
        },
      });
    },
    []
  );

  useEffect(() => {
    if (!locations) {
      return;
    }
    setIsLoading(true);
    geocoder({ type: "location", ...locations })
      .then(
        ({
          address_component: {
            province,
            city,
            district,
            street,
            street_number,
          },
        }) => {
          setLocationCtx({
            ...locations,
            province,
            city,
            district,
            street,
            street_number,
          });
          setIsLoading(false);
        }
      )
      .catch((err) => {
        setFailure(err);
        setIsLoading(false);
      });
  }, [locations]);

  useEffect(() => {
    if (loaded) {
      return;
    }

    wx.getSetting({
      success({ authSetting }) {
        authSettingProcess(authSetting);
      },
      complete() {
        setLoaded(true);
      },
    });
  }, [authSettingProcess, loaded]);

  const tapLocating = useCallback(() => {
    setFailure(null);
    if (isDeny) {
      wx.openSetting({
        success({ authSetting }) {
          if (authSetting["scope.userLocation"] === false) {
            alert("请允许定位授权");
          }
          authSettingProcess(authSetting);
        },
      });
    }
  }, [isDeny, alert, authSettingProcess]);

  let containerElement: React.ReactNode;
  if (isLoading) {
    containerElement = props.loading();
  } else if (failure) {
    containerElement = props.failure(failure);
  } else if (isDeny) {
    containerElement = props.deny();
  } else {
    containerElement = props.loaded(locationCtx);
  }

  const backElement = (
    <View className={s.Wrapper} onTap={tapLocating}>
      {containerElement}
      {alertNode}
    </View>
  );

  return [backElement, { locationCtx, failure, loaded, isLoading, isDeny }];
};
