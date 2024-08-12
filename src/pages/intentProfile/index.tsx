import React, { useMemo, useState } from "react";
import { usePageEvent } from "@remax/macro";
import { useQuery } from "remax";
import { View, Input } from "remax/one";
import { pages } from "@/app.config";
import jumpUrl from "@/utils/jumpUrl";
import { clearBindUserInfomationLock } from "@/utils/toBindUserInfomation";
import { getBasicInfo, submitIntentProfile } from "@/api/auth";
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
  const [gradeList] = useState([
    { grade: 1, title: "幼儿园小班" },
    { grade: 2, title: "幼儿园中班" },
    { grade: 3, title: "幼儿园大班" },
    // { grade: 4, title: '一年级' },
    // { grade: 5, title: '二年级' },
  ] as const);
  const [is_intentlist] = useState([
    { label: "文学美育" },
    { label: "多元思维" },
    { label: "双语文化" },
    { label: "人工智能编程" },
  ]);
  const [currrentAreaId, setCurrentAreaId] = useState(0);
  const [intent_lession, setIntent_lession] = useState("");
  const [phone, setPhone] = useState<any>("");
  const [currrentGrade, setCurrentGrade] = useState(0);
  const { callback } = useQuery();
  const [locateElement, { locationCtx }] = CreateLocation();
  const [showBindPhone, setShowBindPhone] = useState(false);
  const buttonElement = useMemo(() => {
    return (
      <UpdateButton
        updateBefore={async () => {
          console.log(currrentGrade, currrentAreaId, phone);
          if (currrentGrade == undefined || currrentGrade == null) {
            pageCtx.alert("请选择在读年级");
            return false;
          } else if (!currrentAreaId) {
            pageCtx.alert("请选择当前居住区");
            return false;
          } else if (!phone) {
            pageCtx.alert("请输入手机号");
            return false;
          } else if (!intent_lession) {
            pageCtx.alert("请选择意向课程");
            return false;
          } else {
            const areaName =
              areaList.find((item) => item.id === currrentAreaId)?.name || "";
            try {
              await submitIntentProfile({
                grade: currrentGrade,
                phone: phone,
                intent_lession: intent_lession.split(","),
                living_area: areaName,
              });
              return true;
            } catch (err) {
              pageCtx.setError(err);
              return false;
            }
          }
        }}
        onFailure={pageCtx.setError}
        onUpdated={() => {
          wx.navigateBack();
        }}
      >
        提交意向信息
      </UpdateButton>
    );
  }, [
    callback,
    currrentGrade,
    currrentAreaId,
    locationCtx,
    pageCtx,
    phone,
    showBindPhone,
    intent_lession,
  ]);

  async function getAreaListFn() {
    let areaList: any = [];
    await getAreaList()
      .then((list) => {
        // 这里需要确认拿的是广州数据，也就是广州市在第一个
        const guangzhouData = list[0];
        if (guangzhouData && guangzhouData?.children) {
          areaList = guangzhouData?.children.map((item) => {
            return {
              id: item.id,
              name: item.name,
            };
          });
          setAreaList(areaList);
        }
      })
      .catch(pageCtx.setError);
    return areaList;
  }

  usePageEvent("onUnload", clearBindUserInfomationLock);
  usePageEvent("onLoad", async () => {
    const arr: any = await getAreaListFn();
    getBasicInfo()
      .then((res: any) => {
        console.log(res);

        setPhone(res.phone || "");
        setCurrentGrade(Number(res.grade) || 0);
        console.log("areaList", arr);

        arr.forEach((item) => {
          if (item.name === res.living_area) {
            setCurrentAreaId(item.id);
          }
        });
      })
      .catch(pageCtx.setError);
  });

  return (
    <>
      <NavBar
        // background="linear-gradient(90.14deg, #1567E2 0.09%, #1099E6 99.86%)"
        background="linear-gradient(90deg, #1469E1 0%, #1996E6 100%)"
        title="完善信息"
      />
      <View className={s.Page}>
        <View className={s.Title}>请填写意向信息</View>
        <Select
          className={s.select}
          idKey="grade"
          titleKey="title"
          currentId={currrentGrade}
          list={[...gradeList]}
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
        <View className={s.input}>
          <Input
            value={phone}
            style={{ width: "100%" }}
            onInput={(e) => {
              console.log(e.target.value);
              setPhone(e.target.value);
            }}
            placeholder="请输入手机号"
          />
        </View>
        <Mselect
          className={s.select}
          idKey="label"
          titleKey="label"
          currentId={intent_lession}
          placeholderColor="#C6CBD1"
          list={is_intentlist}
          placeholder="选择意向课程"
          onSelect={(label) => {
            console.log("bbbb", label);
            setIntent_lession(label);
          }}
        />
        {buttonElement}
      </View>
    </>
  );
});
