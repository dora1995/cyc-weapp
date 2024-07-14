import { View, Image, Text, Button } from "remax/one";
import React, { useEffect, useRef, useState } from "react";
import s from "../index.scss";
import { getGroupchat, searchSchool } from "@/api/school";
import downIcon from "@/imgs/icon_groupchat_download@2x.png";
import friendIcon from "@/imgs/icon_groupchat_share@2x.png";

function duikou() {
  function getImg() {
    getGroupchat().then((res) => {
      setHaibaoImgUrl(res.group_chat);
    });
  }

  const [haibaoImgUrl, setHaibaoImgUrl] = useState("");

  function handleImgClick() {
    wx.previewImage({
      current: haibaoImgUrl, // 当前显示图片的http链接，注意这里不能放本地图片
      urls: [haibaoImgUrl], // 需要预览的图片http链接列表，注意这里不能放本地图片
      success: function (res) {},
      fail: function (res) {},
      complete: function (res) {},
    });
  }

  function handleImgDown() {
    wx.showLoading({
      title: "加载中...",
    });
    //wx.downloadFile方法：下载文件资源到本地
    wx.downloadFile({
      url: haibaoImgUrl, //图片地址
      success: function (res) {
        //wx.saveImageToPhotosAlbum方法：保存图片到系统相册
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath, //图片文件路径
          success: function (data) {
            wx.hideLoading(); //隐藏 loading 提示框
            wx.showModal({
              title: "提示",
              content: "保存成功",
              modalType: false,
            });
          },
          // 接口调用失败的回调函数
          fail: function (err) {
            if (
              err.errMsg === "saveImageToPhotosAlbum:fail:auth denied" ||
              err.errMsg === "saveImageToPhotosAlbum:fail auth deny" ||
              err.errMsg === "saveImageToPhotosAlbum:fail authorize no response"
            ) {
              wx.showModal({
                title: "提示",
                content: "需要您授权保存相册",
                modalType: false,
                success: (modalSuccess) => {
                  wx.openSetting({
                    success(settingdata) {
                      if (settingdata.authSetting["scope.writePhotosAlbum"]) {
                        wx.showModal({
                          title: "提示",
                          content: "获取权限成功,再次点击图片即可保存",
                          modalType: false,
                        });
                      } else {
                        wx.showModal({
                          title: "提示",
                          content: "获取权限失败，将无法保存到相册哦~",
                          modalType: false,
                        });
                      }
                    },
                    fail(failData) {
                      console.log("failData", failData);
                    },
                    complete(finishData) {
                      console.log("finishData", finishData);
                    },
                  });
                },
              });
            }
          },
          complete(res) {
            wx.hideLoading(); //隐藏 loading 提示框
          },
        });
      },
      fail: function (err) {
        wx.hideLoading();
        wx.showModal({
          title: "提示",
          content: "图片下载失败",
          modalType: false,
        });
      },
    });
  }

  useEffect(() => {
    getImg();
  }, []);
  return (
    <View className={s.SearchArea}>
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
    </View>
  );
}
export default duikou;
