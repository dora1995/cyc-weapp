import { View, Image, Text } from "remax/one";
import React, { useEffect, useRef, useState } from "react";
import s from "../index.scss";
import WxLoading from "@/components/Loading";
import { useMemoizedFn } from "ahooks";
import { searchSchool } from "@/api/school";
import SearchInput from "../components/SearchInput";
import ns from "./styles.scss";
import createLocation from "../components/Location";
import Select from "@/components/Select";
import { getAreaList } from "@/api/area";
import SchoolList from "../components/SchoolList";
interface ISchool {
  id: number;
  school_name: string;
}
interface IArea {
  id: number;
  name: string;
}

const pageDerive = (page: number, isRefresh: boolean) =>
  isRefresh ? 1 : page + 1;

function duikou(props) {
  const { name_status } = props;
  // 学校数据相关
  const [fetching, setFetching] = useState(false);
  const [currrentAreaId, setCurrentAreaId] = useState(0);
  const [searchText, setSearchText] = useState("");
  const [schoolCount, setSchoolCount] = useState(0);
  const [areaList, setAreaList] = useState<IArea[]>([]);
  const [page, setPage] = useState(1);
  const [schoolList, setSchoolList] = useState<ISchool[]>([]);
  const [unload, setUnload] = useState(true);
  const [currentNature, setCurrentNature] = useState(0);

  const hasLoadAll = useRef(false);
  const getList = useMemoizedFn(
    async (
      isRefresh: boolean = true,
      school_name,
      area_id,
      education_nature
    ) => {
      if (hasLoadAll.current) {
        return;
      }
      const pageParam = pageDerive(page, isRefresh);
      let params = {
        search_type: 3,
        school_name,
        area_id,
        education_nature,
        page: pageParam,
        page_size: 20,
      };
      setFetching(true);
      searchSchool(params)
        .then((list) => {
          onSeachFetchDone(list, pageParam);
        })
        .catch((err) => {
          setFetching(false);
        });
    }
  );

  const onSeachFetchDone = (
    { count, rows: newList }: { count: number; rows: typeof schoolList },
    page: number
  ) => {
    setSchoolCount(count);
    setPage(page);
    if (page === 1) {
      setSchoolList(newList);
    } else {
      setSchoolList([...schoolList, ...newList]);
    }
    if (count <= page * 20) {
      hasLoadAll.current = true;
    }
    setUnload(false);
    setFetching(false);
  };

  const handleSearch = () => {
    getList(true);
  };

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

  useEffect(() => {
    getAreaListFn();
    getList(true, searchText, currrentAreaId, currentNature);
  }, []);

  return (
    <View className={s.SearchArea}>
      <View className={s.searchRow}>
        <Select
          className={s.seatchSelect}
          idKey="id"
          titleKey="name"
          currentId={currrentAreaId}
          list={[{ id: 0, name: "全部区域" }, ...areaList]}
          placeholder="全部"
          onSelect={(id) => {
            hasLoadAll.current = false;
            setCurrentAreaId(Number(id));
            getList(true, searchText, Number(id), currentNature);
          }}
        />
      </View>
      <View className={s.searchRow}>
        <Select
          className={s.seatchSelect}
          idKey="id"
          titleKey="name"
          currentId={currentNature}
          list={[
            { id: 0, name: "全部办学性质" },
            { id: 1, name: "公办小学" },
            { id: 2, name: "民办小学" },
          ]}
          placeholder="请选择"
          onSelect={(id) => {
            hasLoadAll.current = false;
            setCurrentNature(Number(id));
            getList(true, searchText, currrentAreaId, Number(id));
          }}
        />
      </View>
      <SearchInput
        placeholder="请输入学校名称"
        value={searchText}
        onInput={(text) => {
          setSearchText(text);
        }}
        onConfirm={(e) => {
          hasLoadAll.current = false;
          getList(true, searchText, currrentAreaId, currentNature);
        }}
      />
      <SchoolList
        showDetail={false}
        count={schoolCount}
        list={schoolList}
        currentTabIndex={0}
        name_status={name_status}
      />

      {fetching && <WxLoading loading={true} />}
    </View>
  );
}
export default duikou;
