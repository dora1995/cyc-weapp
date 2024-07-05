import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { navigateTo, View, Text, Image, Button } from 'remax/one'
import { usePageEvent } from '@remax/macro'
import { getAreaList } from '@/api/area'
import geocoder from '@/api/geocoder'
import { SearchSchoolOpts, getGroupchat, searchSchool } from '@/api/school'
import useMemoizedFn from '@/hooks/useMemoizedFn'
import s from './index.scss'
import createPage from '@/components/CreatePage'
import NavBar from '@/components/NavBar'
import HeadBlock from './components/HeadBlock'
import SearchInput from './components/SearchInput'
import Select from '@/components/Select'
import createLocation from './components/Location'
import SchoolList from './components/SchoolList'
import Unload from './components/Unload'
import Loading from './components/Loading'
import WxLoading from '@/components/Loading'
import downIcon from '@/imgs/icon_groupchat_download@2x.png'
import friendIcon from '@/imgs/icon_groupchat_share@2x.png'
import { useQuery } from 'remax'
import { debounce } from '@/utils/common'
import { useUpdateEffect } from 'ahooks'
import { ScrollView } from '@remax/wechat'
import WindowLayout from '@/components/WindowLayout'
const pageDerive = (page: number, isRefresh: boolean) =>
  isRefresh ? 1 : page + 1

const Tabs = ['定位查', '搜索查', '分类查', '新一衔接']

export interface IArea {
  id: number
  name: string
}
interface ISchool {
  id: number
  school_name: string
}

export default createPage((pageCtx) => {
  const query = useQuery()
  const { tabIndex = 0 } = query
  const [currentTabIndex, setTabIndex] = useState(() => {
    try {
      if (tabIndex) {
        return +tabIndex
      } else {
        return 0
      }
    } catch (e) {
      console.log(e)
      return 0
    }
  })
  const currentTab = Tabs[currentTabIndex]
  const [areaList, setAreaList] = useState<IArea[]>([])
  const [unload, setUnload] = useState(true)
  const [fetching, setFetching] = useState(false)
  const [schoolCount, setSchoolCount] = useState(0)
  const [page, setPage] = useState(1)
  const [schoolList, setSchoolList] = useState<ISchool[]>([])
  const [haibaoImgUrl, setHaibaoImgUrl] = useState('')
  // 搜索条件
  const [currentLocation, setCurrentLocation] = useState('')
  const [searchText, setSearchText] = useState('')
  const [currrentAreaId, setCurrentAreaId] = useState(0)
  const [currentNature, setCurrentNature] = useState(0)
  const [showLayout, setShowLayout] = useState(false)
  const [adSrc, setAdSrc] = useState('')
  const [locateNode, { locationCtx }] = createLocation({
    onTapLoaded(locationCtx) {
      if (locationCtx) {
        const fillText = `${locationCtx.city}${locationCtx.district}${locationCtx.street}`
        setSearchText(fillText)
        setTimeout(() => {
          getList(true)
        }, 0)
      }
    },
  })
  const getLocationRef = useRef({
    latitude: locationCtx?.latitude,
    longitude: locationCtx?.longitude,
    address: `${locationCtx?.city}${locationCtx?.district}${locationCtx?.street}`,
  })

  const onTabChange = (idx: number) => {
    setUnload(true)
    setSchoolList([])
    setSearchText('')
    setTabIndex(idx)
  }

  const onSeachFetchDone = (
    { count, rows: newList }: { count: number; rows: typeof schoolList },
    page: number
  ) => {
    setSchoolCount(count)
    setPage(page)
    if (page === 1) {
      setSchoolList(newList)
    } else {
      setSchoolList([...schoolList, ...newList])
    }
    if (count <= page * 20) {
      hasLoadAll.current = true
    }
    setUnload(false)
    setFetching(false)
  }

  function getAreaListFn() {
    getAreaList()
      .then((list) => {
        // 这里需要确认拿的是广州数据，也就是广州市在第一个
        const guangzhouData = list[0]
        if (guangzhouData && guangzhouData?.children) {
          const areaList = guangzhouData?.children.map((item) => {
            return {
              id: item.id,
              name: item.name,
            }
          })
          setAreaList(areaList)
        }
      })
      .catch(pageCtx.setError)
  }
  const hasLoadAll = useRef(false)

  // const getList = useMemoizedFn(

  //   async (
  //     isRefresh: boolean = true,
  //     currrentAreaIdVal = currrentAreaId,
  //     currentNatureVal = currentNature
  //   ) => {
  //     console.log('aaaa', currrentAreaIdVal);
  //     console.log('bbbb', currentNatureVal);
  //     const _searchText = searchText;
  //     const pageParam = pageDerive(page, isRefresh);
  //     const is_check = false;
  //     let params = {
  //       page: pageParam,
  //       pagesize: 20,
  //       is_check,
  //     };
  //     if (currentTabIndex === 3) {
  //       return;
  //     }
  //     // 如果已经加载完所有数据了，就不再请求了
  //     if (hasLoadAll.current) {
  //       return;
  //     }
  //     switch (currentTabIndex) {
  //       // case 0: {
  //       //   if (searchText == '') {
  //       //     if (locationCtx) {
  //       //       _searchText = `${locationCtx.city}${locationCtx.district}${locationCtx.street}`
  //       //     } else {
  //       //       setUnload(true)
  //       //       return
  //       //     }
  //       //   }
  //       //   // 尝试根据searchText获取坐标，如果可以就继续，不行就提示
  //       //   if (_searchText[_searchText.length - 1] == '街') {
  //       //     _searchText += '道'
  //       //   }
  //       //   const res = await geocoder({
  //       //     // type: 'address',
  //       //     type: 'location',
  //       //     // city: '广州市',
  //       //     // address: _searchText,
  //       //     latitude: getLocationRef.current?.latitude!,
  //       //     longitude: getLocationRef.current?.longitude!,
  //       //   })
  //       //   // if (res.location) {
  //       //   //   const { lng, lat } = res.location
  //       //   //   const { city, district, province, street } = res.address_components
  //       //   //   const fillText = `${province}${city}${district}${street}`
  //       //   //   setCurrentLocation(fillText)
  //       //   // }
  //       //   const { adcode } = res.ad_info
  //       //   params = Object.assign(params, {
  //       //     search_type: 1,
  //       //     // keyword: searchText,
  //       //     location: `${getLocationRef.current?.latitude},${getLocationRef.current?.longitude}`,
  //       //     // location: `${lat},${lng}`,
  //       //     area_code: adcode,
  //       //   })
  //       //   const fillText = getLocationRef.current?.address!
  //       //   setCurrentLocation(fillText)
  //       //   break
  //       // }
  //       case 0: {
  //         params = Object.assign(params, {
  //           search_type: 2,
  //           keyword: _searchText,
  //         });
  //         break;
  //       }
  //       case 1: {
  //         params = Object.assign(params, {
  //           search_type: 3,
  //           area_id: currrentAreaIdVal,
  //           education_nature: currentNatureVal,
  //         });
  //         break;
  //       }
  //     }
  //     setFetching(true);
  //     searchSchool(params as SearchSchoolOpts)
  //       .then((list) => {
  //         onSeachFetchDone(list, pageParam);
  //       })
  //       .catch((err) => {
  //         setFetching(false);
  //         pageCtx.setError(err);
  //       });
  //   }
  // );

  const getList = useMemoizedFn(
    async (
      isRefresh: boolean = true,
      currrentAreaIdVal = currrentAreaId,
      currentNatureVal = currentNature
    ) => {
      let _searchText = searchText
      const pageParam = pageDerive(page, isRefresh)
      const is_check = false
      let params = {
        page: pageParam,
        pagesize: 20,
        is_check,
      }
      if (currentTabIndex === 3) {
        return
      }
      // 如果已经加载完所有数据了，就不再请求了
      if (hasLoadAll.current) {
        return
      }
      switch (currentTabIndex) {
        case 0: {
          if (searchText == '') {
            if (locationCtx) {
              _searchText = `${locationCtx.city}${locationCtx.district}${locationCtx.street}`
            } else {
              setUnload(true)
              return
            }
          }
          // 尝试根据searchText获取坐标，如果可以就继续，不行就提示
          if (_searchText[_searchText.length - 1] == '街') {
            _searchText += '道'
          }
          const res = await geocoder({
            // type: 'address',
            type: 'location',
            // city: '广州市',
            // address: _searchText,
            latitude: getLocationRef.current?.latitude!,
            longitude: getLocationRef.current?.longitude!,
          })
          // if (res.location) {
          //   const { lng, lat } = res.location
          //   const { city, district, province, street } = res.address_components
          //   const fillText = `${province}${city}${district}${street}`
          //   setCurrentLocation(fillText)
          // }
          const { adcode } = res.ad_info
          params = Object.assign(params, {
            search_type: 1,
            // keyword: searchText,
            location: `${getLocationRef.current?.latitude},${getLocationRef.current?.longitude}`,
            // location: `${lat},${lng}`,
            area_code: adcode,
          })
          const fillText = getLocationRef.current?.address!
          setCurrentLocation(fillText)
          break
        }
        case 1: {
          params = Object.assign(params, {
            search_type: 2,
            keyword: _searchText,
          })
          break
        }
        case 2: {
          params = Object.assign(params, {
            search_type: 3,
            area_id: currrentAreaIdVal,
            education_nature: currentNatureVal,
          })
          break
        }
      }
      setFetching(true)
      searchSchool(params as SearchSchoolOpts)
        .then((list) => {
          onSeachFetchDone(list, pageParam)
        })
        .catch((err) => {
          setFetching(false)
          pageCtx.setError(err)
        })
    }
  )

  const handleSearch = useMemo(() => {
    return debounce(() => {
      if (huicheRef.current) {
        huicheRef.current = false
        return
      }
      hasLoadAll.current = false
      getList(true)
    }, 2000)
  }, [])

  const wxLoadingNode = useMemo(() => <WxLoading loading={true} />, [])
  const listingElement = useMemo(() => {
    if (currentTabIndex === 3) {
      return null
    }
    if (fetching) {
      if (unload) {
        return <Loading />
      }
    } else if (unload) {
      return <Unload />
    }
    return (
      <>
        <SchoolList
          count={schoolCount}
          list={schoolList}
          currentTabIndex={currentTabIndex}
          onTapIndex={(idx) => {
            const { id, school_name } = schoolList[idx]
            navigateTo({
              url: `/pages/school-detail/index?id=${id}`,
            })
          }}
        />
        {fetching && wxLoadingNode}
      </>
    )
  }, [
    fetching,
    schoolCount,
    schoolList,
    unload,
    wxLoadingNode,
    currentTabIndex,
  ])

  function handleImgDown() {
    wx.showLoading({
      title: '加载中...',
    })
    //wx.downloadFile方法：下载文件资源到本地
    wx.downloadFile({
      url: haibaoImgUrl, //图片地址
      success: function (res) {
        //wx.saveImageToPhotosAlbum方法：保存图片到系统相册
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath, //图片文件路径
          success: function (data) {
            wx.hideLoading() //隐藏 loading 提示框
            wx.showModal({
              title: '提示',
              content: '保存成功',
              modalType: false,
            })
          },
          // 接口调用失败的回调函数
          fail: function (err) {
            if (
              err.errMsg === 'saveImageToPhotosAlbum:fail:auth denied' ||
              err.errMsg === 'saveImageToPhotosAlbum:fail auth deny' ||
              err.errMsg === 'saveImageToPhotosAlbum:fail authorize no response'
            ) {
              wx.showModal({
                title: '提示',
                content: '需要您授权保存相册',
                modalType: false,
                success: (modalSuccess) => {
                  wx.openSetting({
                    success(settingdata) {
                      if (settingdata.authSetting['scope.writePhotosAlbum']) {
                        wx.showModal({
                          title: '提示',
                          content: '获取权限成功,再次点击图片即可保存',
                          modalType: false,
                        })
                      } else {
                        wx.showModal({
                          title: '提示',
                          content: '获取权限失败，将无法保存到相册哦~',
                          modalType: false,
                        })
                      }
                    },
                    fail(failData) {
                      console.log('failData', failData)
                    },
                    complete(finishData) {
                      console.log('finishData', finishData)
                    },
                  })
                },
              })
            }
          },
          complete(res) {
            wx.hideLoading() //隐藏 loading 提示框
          },
        })
      },
      fail: function (err) {
        wx.hideLoading()
        wx.showModal({
          title: '提示',
          content: '图片下载失败',
          modalType: false,
        })
      },
    })
  }
  // 页面下拉到底部时触发
  usePageEvent('onReachBottom', () => {
    if (fetching) {
      return
    }
    getList(false)
  })

  function getImg() {
    getGroupchat()
      .then((res) => {
        setHaibaoImgUrl(res.group_chat)
        if (res.advertise_show === 1 && res.advertise_pic) {
          setShowLayout(true)
          setAdSrc(res.advertise_pic)
        }
      })
      .catch(pageCtx.setError)
  }
  usePageEvent('onLoad', () => {
    getAreaListFn()
    getImg()
  })
  // 意向收集
  function imgClick() {
    console.log('aaaa')

    wx.navigateTo({ url: '/pages/intentProfile/index' })
  }
  useEffect(() => {
    hasLoadAll.current = false
    switch (currentTabIndex) {
      case 0: {
        const searchKey = ''
        setSearchText('')
        if (locationCtx) {
          // searchKey = `${locationCtx.city}${locationCtx.district}${locationCtx.street}`
          // setSearchText(searchKey)
          getLocationRef.current = {
            latitude: locationCtx.latitude,
            longitude: locationCtx.longitude,
            address: `${locationCtx.city}${locationCtx.district}${locationCtx.street}`,
          }
          getList(true)
        } else {
          // setSearchText('')
          setCurrentLocation('正在定位')
        }
        break
      }
      case 1: {
        getList(true)
        break
      }
      case 2: {
        // 分类查，先按全部获取
        getList(true)
        break
      }
    }
  }, [currentTabIndex])

  usePageEvent('onShareAppMessage', () => {
    return {
      title: '广州小学信息查一查',
      path: 'pages/tab-home/index?tabIndex=3',
    }
  })
  usePageEvent('onShareTimeline', () => {
    return {
      title: '广州小学信息查一查',
      path: 'pages/tab-home/index?tabIndex=3',
    }
  })

  function handleImgClick() {
    wx.previewImage({
      current: haibaoImgUrl, // 当前显示图片的http链接，注意这里不能放本地图片
      urls: [haibaoImgUrl], // 需要预览的图片http链接列表，注意这里不能放本地图片
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  }
  const huicheRef = useRef(false)
  //定位变化的情况
  useUpdateEffect(() => {
    if (locationCtx) {
      if (tabIndex == 0) {
        // let searchKey = ''
        if (locationCtx) {
          getLocationRef.current = {
            latitude: locationCtx.latitude,
            longitude: locationCtx.longitude,
            address: `${locationCtx.city}${locationCtx.district}${locationCtx.street}`,
          }
          // searchKey = `${locationCtx.city}${locationCtx.district}${locationCtx.street}`
          // setSearchText(searchKey)
          getList(true)
        }
      }
    }
  }, [locationCtx])

  function getLocationClick() {
    wx.chooseLocation({
      fail: (err) => {
        console.log(err)
      },
      success: (res) => {
        console.log(res)
        hasLoadAll.current = false
        getLocationRef.current = {
          latitude: res.latitude,
          longitude: res.longitude,
          address: res.name,
        }
        getList(true)
      },
    })
  }
  return (
    <View className={s.Page}>
      <NavBar
        hideNavIcon={true}
        fillHeight={false}
        title="广州小学信息查一查"
        background="linear-gradient(90deg, #1469E1 0%, #1996E6 100%)"
      />
      <HeadBlock
        tabs={[...Tabs]}
        currentIndex={currentTabIndex}
        onTapTabIndex={onTabChange}
      />
      <View className={s.SearchArea}>
        {currentTab === '定位查' ? (
          <>
            <Button onTap={getLocationClick}>选择定位</Button>
            {/* <SearchInput
              placeholder='请输入位置'
              value={searchText}
              onInput={(text) => {
                setSearchText(text)
                handleSearch()
              }}
              onConfirm={(e) => {
                // if (!searchText.length) {
                //   return pageCtx.alert('请输入位置')
                // }
                huicheRef.current = true
                hasLoadAll.current = false
                getList(true)
              }}
            /> */}
            {/* {locateNode} */}
            <div className={s.newLocation}>当前定位：{currentLocation}</div>
          </>
        ) : null}
        {currentTab === '搜索查' ? (
          <SearchInput
            placeholder="请输入学校名称"
            value={searchText}
            onInput={(text) => {
              setSearchText(text)
              handleSearch()
            }}
            onConfirm={(e) => {
              if (!searchText.length) {
                return pageCtx.alert('请输入学校名称')
              }
              huicheRef.current = true
              hasLoadAll.current = false
              getList(true)
            }}
          />
        ) : null}
        {currentTab === '分类查' ? (
          <>
            <View className={s.searchRow}>
              <Text className={s.searchTitle}>所在区域</Text>
              <Select
                className={s.seatchSelect}
                idKey="id"
                titleKey="name"
                currentId={currrentAreaId}
                list={[{ id: 0, name: '全部' }, ...areaList]}
                placeholder="全部"
                onSelect={(id) => {
                  hasLoadAll.current = false
                  setCurrentAreaId(Number(id))
                  getList(true, id)
                }}
              />
            </View>
            <View className={s.searchRow}>
              <Text className={s.searchTitle}>办学性质</Text>
              <Select
                className={s.seatchSelect}
                idKey="id"
                titleKey="name"
                currentId={currentNature}
                list={[
                  { id: 0, name: '全部' },
                  { id: 1, name: '公办小学' },
                  { id: 2, name: '民办小学' },
                ]}
                placeholder="请选择"
                onSelect={(id) => {
                  hasLoadAll.current = false
                  setCurrentNature(Number(id))
                  getList(true, undefined, id)
                }}
              />
            </View>
          </>
        ) : null}

        {currentTab === '新一衔接' ? (
          <View className={s.intoQr}>
            <Image
              onTap={handleImgClick}
              mode="widthFix"
              className={s.intoQrImg}
              src={haibaoImgUrl}
              wechat-show-menu-by-longpress={true}
            />
            <View className={s.btns}>
              <View className={s.btn} onTap={() => handleImgDown()}>
                <Image mode="widthFix" className={s.img} src={downIcon} />
                保存到相册扫码
              </View>
              <Button open-type="share" className={s.shareBtn}>
                <View className={s.btn}>
                  <Image mode="widthFix" className={s.img} src={friendIcon} />
                  分享给好友
                </View>
              </Button>
            </View>
          </View>
        ) : null}
        {listingElement}
        <WindowLayout zIndex={9999} show={showLayout}>
          <View className={s.ad}>
            <ScrollView scrollY className={s.SelectList}>
              <Image
                onTap={imgClick}
                mode="widthFix"
                className={s.intoQrImg}
                src={adSrc}
              />
            </ScrollView>
            <View className={s.closeBtn}>
              <View onTap={() => setShowLayout(false)} className={s.btn}>
                我已了解
              </View>
            </View>
          </View>
        </WindowLayout>
      </View>
    </View>
  )
})
