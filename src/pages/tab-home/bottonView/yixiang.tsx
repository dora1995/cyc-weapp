import { View, Image, Text, Input, Button } from "remax/one";
import React, { useEffect, useRef, useState } from "react";
import s from "../index.scss";
import WxLoading from "@/components/Loading";
import { useMemoizedFn, useUpdateEffect } from "ahooks";
import { getGroupchat, searchSchool } from "@/api/school";
import SearchInput from "../components/SearchInput";
import ns from "./styles.scss";
import Mselect from "@/components/Select";
import createLocation from "../components/Location";
import Select from "@/components/Select";
import { getAreaList } from "@/api/area";
import UpdatePhoneButton from "@/components/UpdatePhoneInfo/Button";
import { submitIntentSurvey } from "@/api/auth";
import {
  getStorageInfoSync,
  getStorageSync,
  setStorageSync,
} from "remax/wechat";
interface ISchool {
  id: number;
  school_name: string;
}
interface IArea {
  id: number;
  name: string;
}

function duikou() {
  // 学校数据相关
  const [fetching, setFetching] = useState(false);
  const [areaList, setAreaList] = useState<IArea[]>([]);
  function getAreaListFn() {
    getAreaList().then((list) => {
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
    });
  }

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

  useEffect(() => {
    getAreaListFn();
    getImg();
  }, []);

  const [gradeList, setGradeList] = useState([]);

  const liaojieList = [
    { value: 1, title: "意向了解" },
    { value: 2, title: "暂不了解" },
  ];

  const hujiList = [
    { value: 1, title: "越秀区户籍" },
    { value: 2, title: "海珠区户籍" },
    { value: 3, title: "荔湾区户籍" },
    { value: 4, title: "天河区户籍" },
    { value: 5, title: "白云区户籍" },
    { value: 6, title: "黄埔区户籍" },
    { value: 7, title: "番禺区户籍" },
    { value: 8, title: "花都区户籍" },
    { value: 9, title: "南沙区户籍" },
    { value: 10, title: "增城区户籍" },
    { value: 11, title: "从化区户籍" },
    { value: 12, title: "非广州市户籍" },
  ];

  const [name, setName] = useState("");
  const [currrentGrade, setCurrentGrade] = useState();
  const [huji, setHuji] = useState(0);
  const [phone, setPhone] = useState("");
  const [yixiangAreaId, setYixiangAreaId] = useState(0);
  const [yixiangSchoolId, setYixiangSchoolId] = useState(0);
  const [yixiang, setYixiang] = useState(0);

  const [schoolList, setSchoolList] = useState<ISchool[]>([]);

  function getSchoolList(id: number) {
    setFetching(true);
    searchSchool({
      search_type: 5,
      page: 1,
      page_size: 10000,
      area_id: id,
    })
      .then((list) => {
        setSchoolList(list.rows || []);
      })
      .finally(() => {
        setFetching(false);
      });
  }
  useEffect(() => {
    if (yixiangAreaId) {
      getSchoolList(yixiangAreaId);
    } else {
      setSchoolList([]);
    }
  }, [yixiangAreaId]);

  function handleSubmit() {
    if (!name) {
      wx.showToast({
        title: "请输入孩子姓名",
        icon: "none",
      });
      return;
    }
    if (!currrentGrade) {
      wx.showToast({
        title: "请选择在读年级",
        icon: "none",
      });
      return;
    }
    if (!huji) {
      wx.showToast({
        title: "请选择户籍地所在区",
        icon: "none",
      });
      return;
    }
    if (!phone) {
      wx.showToast({
        title: "请输入手机号",
        icon: "none",
      });
      return;
    }
    if (!yixiangAreaId) {
      wx.showToast({
        title: "请选择意向学校所在区",
        icon: "none",
      });
      return;
    }
    if (!yixiangSchoolId) {
      wx.showToast({
        title: "请选择意向的民办学校",
        icon: "none",
      });
      return;
    }
    if (!yixiang) {
      wx.showToast({
        title: "请选择是否了解新一衔接课程",
        icon: "none",
      });
      return;
    }
    submitIntentSurvey({
      name,
      grade: currrentGrade,
      grade_content: gradeList.find((item) => item.grade == currrentGrade)
        ?.title,
      living_area: hujiList.find((item) => item.value == huji)?.title,
      phone: phone,
      intent_area: areaList.find((item) => item.id == yixiangAreaId)?.name,
      intent_school: schoolList.find((item) => item.id == yixiangSchoolId)
        ?.school_name,
      is_intent_lession: yixiang,
    }).then(() => {
      wx.showToast({
        title: "提交成功",
      });
    });
  }

  useUpdateEffect(() => {
    setStorageSync("intentProfile", {
      name,
      currrentGrade,
      huji,
      phone,
      yixiangAreaId,
      yixiangSchoolId,
      yixiang,
    });
  }, [
    name,
    currrentGrade,
    huji,
    phone,
    yixiangAreaId,
    yixiangSchoolId,
    yixiang,
  ]);
  console.log(6666);
  useEffect(() => {
    const sto = getStorageSync("intentProfile");
    const {
      name,
      currrentGrade,
      huji,
      phone,
      yixiangAreaId,
      yixiangSchoolId,
      yixiang,
    } = sto;
    setName(name);
    setCurrentGrade(currrentGrade);
    setHuji(huji);
    setPhone(phone);
    setYixiangAreaId(yixiangAreaId);
    setYixiangSchoolId(yixiangSchoolId);
    setYixiang(yixiang);
  }, []);
  return (
    <View className={s.SearchArea}>
      <View style={{ marginBottom: "8px" }}>
        <SearchInput
          placeholder="请输入孩子姓名"
          value={name}
          onInput={(text) => {
            setName(text);
          }}
          onConfirm={() => {}}
          showIcon={false}
        />
      </View>
      <Select
        className={s.select}
        idKey="grade"
        titleKey="title"
        currentId={currrentGrade}
        list={gradeList}
        placeholder="选择孩子年级"
        placeholderColor="#C6CBD1"
        onSelect={(id) => {
          setCurrentGrade(Number(id));
        }}
      />
      <Select
        className={s.select}
        idKey="value"
        titleKey="title"
        currentId={huji}
        placeholderColor="#C6CBD1"
        list={hujiList}
        placeholder="请选择户籍所在区"
        onSelect={(id) => {
          console.log(id);
          setHuji(Number(id));
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
            style={{
              width: "100px",
              backgroundColor: "#5780EA !important",
              color: "#fff !important",
            }}
            updateBefore={async () => {
              return true;
            }}
            onUpdated={(data) => {
              if (data && data.phone) {
                setPhone(data.phone);
              }
            }}
          >
            一键授权
          </UpdatePhoneButton>
        </View>
      </View>

      <Select
        className={s.select}
        idKey="id"
        titleKey="name"
        currentId={yixiangAreaId}
        placeholderColor="#C6CBD1"
        list={areaList}
        placeholder="请选择意向学校所在区"
        onSelect={(id) => {
          console.log(id);
          setYixiangAreaId(Number(id));
        }}
      />
      <Select
        className={s.select}
        idKey="id"
        titleKey="school_name"
        currentId={yixiangSchoolId}
        placeholderColor="#C6CBD1"
        list={schoolList}
        placeholder="请选择意向的民办学校"
        onSelect={(id) => {
          console.log(id);
          setYixiangSchoolId(Number(id));
        }}
      />
      <Select
        className={s.select}
        idKey="value"
        titleKey="title"
        currentId={yixiang}
        placeholderColor="#C6CBD1"
        list={liaojieList}
        placeholder="是否了解新一衔接课程"
        onSelect={(id) => {
          console.log(id);
          setYixiang(Number(id));
        }}
      />
      <Button
        style={{
          marginTop: "40px",
          backgroundColor: "#5780EA",
          color: "#fff",
        }}
        onTap={handleSubmit}
      >
        确认信息
      </Button>
      {fetching && <WxLoading loading={true} />}
    </View>
  );
}
export default duikou;
