import React, { useMemo, useState } from "react";
import { usePageEvent } from "@remax/macro";
import { useQuery } from "remax";
import { View, Input, Button } from "remax/one";
import { pages } from "@/app.config";
import jumpUrl from "@/utils/jumpUrl";
import { clearBindUserInfomationLock } from "@/utils/toBindUserInfomation";
import { getBasicInfo, submitBasicInfo, submitIntentProfile } from "@/api/auth";
import createPage from "@/components/CreatePage";
import NavBar from "@/components/NavBar";
import Select from "@/components/Select";
import Mselect from "./components/Select";
import CreateLocation from "./components/Location";
import UpdateButton from "@/components/UpdateUserInfo/Button";
import UpdatePhoneButton from "@/components/UpdatePhoneInfo/Button";
import s from "./index.scss";
import { getAreaList } from "@/api/area";
import { IArea } from "../tab-home";
import { getGroupchat } from "@/api/school";

export const jumpCallbackPage = (callback: string | undefined) => {
  if (callback) {
    jumpUrl(callback, true);
  } else {
    jumpUrl(`/${pages[0]}`, true);
  }
};
export const jumpCallbackPageWithURI = (callback: string | undefined) => {
  // wx.navigateBack()
  if (callback) {
    jumpCallbackPage(decodeURIComponent(callback));
  } else {
    jumpCallbackPage(undefined);
  }
};

export default createPage((pageCtx) => {
  const [areaList, setAreaList] = useState<IArea[]>([]);
  const [gradeList, setGradeList] = useState([]);
  const [intent_lession, setIntent_lession] = useState("");
  const [is_intentlist] = useState([
    { value: "文学美育", label: "意向了解“文学美育”" },
    { value: "多元思维", label: "意向了解“多元思维”" },
    { value: "双语文化", label: "意向了解“双语文化”" },
    { value: "人工智能编程", label: "意向了解“人工智能编程”" },
    { value: "暂无意向", label: "暂无意向" },
  ]);
  const [currrentAreaId, setCurrentAreaId] = useState(0);
  const [is_intent, setIs_intent] = useState<null | number>(null);
  const [phone, setPhone] = useState("");
  const [currrentGrade, setCurrentGrade] = useState();
  const { callback } = useQuery();
  const [locateElement, { locationCtx }] = CreateLocation();
  // const [showBindPhone, setShowBindPhone] = useState(true)
  const buttonElement = useMemo(() => {
    return (
      <UpdateButton
        updateBefore={async () => {
          if (currrentGrade == undefined || currrentGrade == null) {
            pageCtx.alert("请选择在读年级");
            return false;
          } else if (!currrentAreaId) {
            pageCtx.alert("请选择当前居住区");
            return false;
          } else if (!intent_lession) {
            pageCtx.alert("请选择是否有意向了解新一衔接规划");
            return false;
          } else if (!phone) {
            console.log("aaa", phone);

            pageCtx.alert("请输入手机号");
            return false;
          } else {
            const areaName =
              areaList.find((item) => item.id === currrentAreaId)?.name || "";
            try {
              await submitBasicInfo({
                lng: locationCtx ? `${locationCtx.longitude}` : "",
                lat: locationCtx ? `${locationCtx.latitude}` : "",
                phone: phone,
                grade: currrentGrade,
                grade_content: gradeList.find(
                  (item) => item.grade == currrentGrade
                )?.title,
                is_intent:
                  intent_lession === "暂无意向"
                    ? 0
                    : intent_lession.split(",").length,
                location: locationCtx
                  ? `${locationCtx.district}${locationCtx.street}`
                  : "",
                living_area: areaName,
              });
              if (intent_lession !== "暂无意向") {
                await submitIntentProfile({
                  grade: currrentGrade,
                  phone: phone,
                  intent_lession: intent_lession.split(","),
                  living_area: areaName,
                });
              }
              clearBindUserInfomationLock();
              jumpCallbackPageWithURI(callback);
              return true;
            } catch (err) {
              pageCtx.setError(err);
              return false;
            }
          }
        }}
        onFailure={pageCtx.setError}
        onUpdated={() => {
          // setShowBindPhone(true)
        }}
      >
        确认信息
      </UpdateButton>
    );
    // if (showBindPhone) {
    //   return (
    //     <UpdatePhoneButton
    //       updateBefore={async () => {
    //         return true
    //       }}
    //       onFailure={pageCtx.setError}
    //       onUpdated={() => {
    //         clearBindUserInfomationLock()
    //         jumpCallbackPageWithURI(callback)
    //       }}
    //     >
    //       手机号授权
    //     </UpdatePhoneButton>
    //   )
    // } else {

    // }
  }, [
    callback,
    currrentGrade,
    currrentAreaId,
    is_intent,
    locationCtx,
    pageCtx,
    phone,
    intent_lession,
  ]);

  function getAreaListFn() {
    getAreaList()
      .then((list) => {
        // 这里需要确认拿的是广州数据，也就是广州市在第一个
        const guangzhouData = list[0];
        if (guangzhouData && guangzhouData?.children) {
          const areaList = guangzhouData?.children.map((item) => {
            return {
              id: item.id,
              name: item.name,
            };
          });
          setAreaList(areaList);
        }
      })
      .catch(pageCtx.setError);
  }

  usePageEvent("onUnload", clearBindUserInfomationLock);
  usePageEvent("onLoad", () => {
    getAreaListFn();
    getImg();
  });

  function getImg() {
    getGroupchat().then((res) => {
      if (res.grade) {
        setGradeList(
          res.grade.map((item) => {
            return {
              grade: item.grade,
              title: item.grade_content,
            };
          })
        );
      }
    });
  }

  return (
    <>
      <NavBar
        // background="linear-gradient(90.14deg, #1567E2 0.09%, #1099E6 99.86%)"
        background="linear-gradient(90deg, #1469E1 0%, #1996E6 100%)"
        title="完善信息"
      />
      <View className={s.Page}>
        <View className={s.Title}>请完善一下信息</View>
        <Select
          className={s.select}
          idKey="grade"
          titleKey="title"
          currentId={currrentGrade}
          list={gradeList}
          placeholder="选择在读年级"
          placeholderColor="#C6CBD1"
          onSelect={(id) => {
            setCurrentGrade(Number(id));
          }}
        />
        <Select
          className={s.select}
          idKey="id"
          titleKey="name"
          currentId={currrentAreaId}
          placeholderColor="#C6CBD1"
          list={areaList}
          placeholder="选择当前居住区"
          onSelect={(id) => {
            console.log(id);
            setCurrentAreaId(Number(id));
          }}
        />

        <Mselect
          className={s.select}
          idKey="value"
          titleKey="label"
          currentId={intent_lession}
          placeholderColor="#C6CBD1"
          list={is_intentlist}
          placeholder="意向了解新一衔接课程"
          onSelect={(label) => {
            setIntent_lession(label);
          }}
        />
        <View className={s.phone}>
          <View className={s.input}>
            <Input
              value={phone}
              onInput={(e) => {
                console.log(e.target.value);
                setPhone(e.target.value);
              }}
              placeholder="请输入手机号"
            />
          </View>
          <View>
            <UpdatePhoneButton
              style={{ width: "100px" }}
              updateBefore={async () => {
                return true;
              }}
              onFailure={pageCtx.setError}
              onUpdated={(data) => {
                if (data && data.phone) {
                  setPhone(data.phone);
                }

                // clearBindUserInfomationLock()
                // jumpCallbackPageWithURI(callback)
              }}
            >
              一键授权
            </UpdatePhoneButton>
          </View>
        </View>
        {locateElement}
        {buttonElement}
      </View>
    </>
  );
});
