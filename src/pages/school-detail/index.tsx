import React, { useMemo, useState } from 'react'
import { intentProfile } from '@/app.config'
import { usePageEvent } from '@remax/macro'
import { getGroupchat } from '@/api/school'
import { Image, View } from '@remax/one'
import { Map } from '@remax/wechat'
import createPage from '@/components/CreatePage'
import NavBar from '@/components/NavBar'
import { useLoading } from '@/components/Loading'
import { getSchoolDetail, SchoolDetail } from '@/api/school'
import useQueryWithScene from '@/hooks/useQueryWithScene'
import s from './index.scss'
import Icon1 from '@/imgs/icon_school_address@2x.png'
import Icon2 from '@/imgs/icon_school_attribute@2x.png'
import Icon3 from '@/imgs/icon_school_type@2x.png'
import Icon4 from '@/imgs/icon_school_tuition@2x.png'
import Icon5 from '@/imgs/icon_school_stay@2x.png'
import Icon6 from '@/imgs/icon_school_phone@2x.png'
import Icon7 from '@/imgs/icon_school_plan@2x.png'
import Icon8 from '@/imgs/icon_school_area@2x.png'
import Icon9 from '@/imgs/icon_school_middle@2x.png'
import Icon10 from '@/imgs/icon_school_official@2x.png'
import Icon11 from '@/imgs/icon_school_rules@2x.png'
import MapIcon from '@/imgs/icon_map_location@2x.png'
import ToMapIcon from '@/imgs/icon_map_navigate@2x.png'
import { navigateTo } from 'remax/one'
import MpHtml from 'mp-html/dist/mp-weixin/index'
import Modal from '@/components/Modal'
import { tranferStr } from '@/utils/tranferStr'

export default createPage((pageCtx) => {
  const [detail, setDetail] = useState<null | SchoolDetail>(null)
  const makers = [
    {
      id: 1,
      latitude: detail?.latitude,
      longitude: detail?.longitude,
      iconPath: MapIcon,
      width: 40,
      height: 40,
      anchor: { x: 0.5, y: 0.5 },
    },
  ]
  const [loadingNode, setLoading] = useLoading()
  const [wxModalShow, setWxModalShow] = useState(false)
  const [urlModalShow, setUrlModalShow] = useState(false)
  const [bannerUrl, setBannerUrl] = useState('')
  const { id } = useQueryWithScene()
  usePageEvent('onLoad', () => {
    setLoading(true)
    getSchoolDetail({ school_id: Number(id) })
      .then((res) => {
        setLoading(false)
        setDetail(res)
      })
      .catch((err) => {
        setLoading(false)
        pageCtx.setError(err)
      })
    getGroupchat()
      .then((res) => {
        setBannerUrl(res.banner)
      })
      .catch(pageCtx.setError)
  })

  usePageEvent('onShareAppMessage', () => {
    return {
      title: `${detail?.school_name}`,
    }
  })
  usePageEvent('onShareTimeline', () => {
    return {
      title: `${detail?.school_name}`,
    }
  })

  const schoolLocationList = useMemo(() => {
    if (detail?.school_enr_location) {
      const { school_enr_location } = detail
      return school_enr_location.split(/,|，/g)
    } else {
      return []
    }
  }, [detail])

  const bodyNode = useMemo(() => {
    if (!detail) {
      return <></>
    }
    const Education = { 1: '公办小学', 2: '民办小学', 3: '' }

    const dataList = [
      { icon: Icon1, value: detail?.geo_position, label: '地址' },
      {
        icon: Icon2,
        value: Education[detail?.education_nature || 3],
        label: '办学性质',
      },
      { icon: Icon3, value: detail?.spec_type, label: '特殊类型' },
      { icon: Icon4, value: detail?.tuition, label: '学费' },
      { icon: Icon5, value: detail?.stay, label: '住宿' },
      { icon: Icon6, value: detail?.enr_telphone, label: '招生电话' },
      {
        icon: Icon7,
        value: detail?.enrollment_plan,
        label: '招生计划(班/人)(2023)',
      },
      {
        icon: Icon8,
        value: tranferStr(detail?.school_enr_location),
        label: '招生地段(2023)',
        isRich: true,
      },
      {
        icon: Icon9,
        value: tranferStr(detail?.middle_shcool_dk),
        label: '对口中学(2023)',
        isRich: true,
      },
      {
        icon: Icon10,
        value: detail?.mp_name,
        label: '官方公众号',
        canCopy: true,
        hasExemple: 'mp',
      },
      {
        icon: Icon11,
        value: detail?.enrollment_rules,
        label: '招生简章(2023)',
        canCopy: true,
        hasExemple: 'en',
      },
    ]

    function handleCopy(item: any) {
      if (item.value === '/' || item.value === '') return
      if (item?.canCopy) {
        wx.setClipboardData({
          data: item.value,
          success: () => {
            wx.hideLoading()
            if (item.label === '官方公众号') {
              setWxModalShow(true)
            }
            if (item.label === '招生简章') {
              setUrlModalShow(true)
            }
          },
        })
      }
    }
    function handleLook(e, type) {
      e.stopPropagation()
      navigateTo({
        url: `/pages/look-examples/index?type=${type}`,
      })
    }
    function handleFineMeClick() {
      wx.openCustomerServiceChat({
        extInfo: { url: 'https://work.weixin.qq.com/kfid/kfc312ffc525815909c' },
        corpId: 'wx110001df99daf0de',
        fail: function (res) {
          wx.showToast({
            title: res.errMsg,
            icon: 'none',
          })
        },
      })
    }
    // 意向收集
    function imgClick() {
      console.log('aaaa')

      wx.navigateTo({ url: '/pages/intentProfile/index' })
    }
    return (
      <>
        <View className={s.MapArea}>
          <Map
            className={s.Map}
            enableScroll={false}
            enableZoom={false}
            enableRotate={false}
            markers={makers}
            enableBuilding={true}
            enablePoi={true}
            latitude={Number(detail?.latitude)}
            longitude={Number(detail?.longitude)}
          ></Map>
          <View
            className={s.CentreView}
            onTap={(e) => {
              wx.openLocation({
                name: detail.school_name,
                longitude: Number(detail?.longitude),
                latitude: Number(detail?.latitude),
              })
            }}
          >
            <View className={s.Label}>{detail?.school_name}</View>
            <Image className={s.MessageBackgroundImage} src={ToMapIcon} />
          </View>
        </View>
        <View className={s.InfoAbove}>
          <View className={s.SchoolName}>{detail?.school_name}</View>
          <View className={s.areaName}>{detail.area_name}</View>
          {dataList.map((item, idx) => {
            if (item.value) {
              return (
                <View className={s.module} key={idx}>
                  <View className={s.title}>
                    <Image className={s.titleIcon} src={item.icon} />
                    <View className={s.titleLabel}>{item.label}</View>
                  </View>
                  {item?.isRich ? (
                    <MpHtml
                      container-style={{
                        background: '#FBFBFB',
                        padding: '27rpx 20rpx',
                        'font-size': '36rpx',
                        color: '#4B5B6D',
                        'max-height': '450rpx',
                        overflow: 'auto',
                      }}
                      content={item.value}
                    />
                  ) : (
                    <View
                      className={`${s.value} ${item.hasExemple ? s.hasExemple : ''
                        } ${item.label === '招生简章' ? s.more : ''}`}
                      onTap={() => handleCopy(item)}
                    >
                      {item.value}
                      {item.hasExemple &&
                        item.value != '' &&
                        item.value != '/' ? (
                        <View className={s.exp}>查看</View>
                      ) : null}
                    </View>
                  )}
                </View>
              )
            }
            return null
          })}
          <View className={s.module}>
            {/*  */}
            <View className={s.title}>
              <View className={s.titleLabel}>意见反馈</View>
            </View>
            <View
              className={`${s.value} ${s.hasExemple} ${s.more}`}
              onTap={handleFineMeClick}
            >
              {/* <View className={`${s.value} ${s.hasExemple} ${s.more}`} onTap={() => navigateTo({ url: '/pages/mp/index'}) }> */}
              向小程序开发者反馈意见/问题
              <View className={s.exp}>查看</View>
            </View>
          </View>
          <View className={s.module}>
            <Image
              onTap={imgClick}
              mode="widthFix"
              className={s.bannerImg}
              src={bannerUrl}
              wechat-show-menu-by-longpress={true}
            />
          </View>
          {/* <View
            className={s.ContactPhone}
            onTap={() => {
              const phoneNumber = `${detail?.enr_telphone}`
              const itemList = ['呼叫', '复制号码', '添加到手机通讯录'] as const
              wx.showActionSheet({
                itemList: [...itemList],
                success(res) {
                  switch (itemList[res.tapIndex]) {
                    case '呼叫':
                      wx.makePhoneCall({ phoneNumber })
                      break
                    case '复制号码':
                      wx.setClipboardData({ data: phoneNumber })
                      break
                    case '添加到手机通讯录':
                      wx.addPhoneContact({
                        firstName: '学校名字哦',
                        nickName: '学校名字哦',
                        workPhoneNumber: phoneNumber,
                      })
                      break
                  }
                },
                fail(res) {
                  console.log(res.errMsg)
                },
              })
            }}
          >
            <Image className={s.ContactIcon} src={ContactPhone} />
            <View className={s.ContactLabel}>招生电话</View>
            <View className={s.ContactPhoneNumber}>{detail?.enr_telphone}</View>
          </View> */}
        </View>
      </>
    )
  }, [detail, makers, schoolLocationList])

  function lookWxExemple() {
    setWxModalShow(false)
    navigateTo({
      url: '/pages/look-examples/index?type=mp',
    })
  }
  function lookUrlExemple() {
    setUrlModalShow(false)
    navigateTo({
      url: '/pages/look-examples/index?type=en',
    })
  }

  return (
    <>
      <NavBar
        background="linear-gradient(90deg, #1469E1 0%, #1996E6 100%)"
        title="学校详情"
      />
      {loadingNode}
      {bodyNode}

      <Modal
        show={wxModalShow}
        title="温馨提示"
        body={
          <View className={s.ModalBody}>
            <View className={s.ModalText}>公众号名称已 自动复制；</View>
            <View className={s.ModalText}>请在微信搜索；</View>
            <View className={s.ModalText}>粘粘 该公众号名称；</View>
            <View className={s.ModalText}>有疑问可 查看示例 步骤。</View>
          </View>
        }
        type="confirm"
        confirmText="查看示例"
        cancelText="关闭"
        onConfirm={() => lookWxExemple()}
        onCancel={() => setWxModalShow(false)}
      />
      <Modal
        show={urlModalShow}
        title="温馨提示"
        body={
          <View className={s.ModalBody}>
            <View className={s.ModalText}>招生简章链接已 自动复制；</View>
            <View className={s.ModalText}>请打开手机浏览器；</View>
            <View className={s.ModalText}>粘粘 该地址；</View>
            <View className={s.ModalText}>有疑问可 查看示例 步骤。</View>
          </View>
        }
        type="confirm"
        confirmText="查看示例"
        cancelText="关闭"
        onConfirm={() => lookUrlExemple()}
        onCancel={() => setUrlModalShow(false)}
      />
    </>
  )
})
