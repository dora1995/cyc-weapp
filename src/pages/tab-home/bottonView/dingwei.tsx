import { Button, View } from "remax/one";
import React from "react";
function duikou() {
  function getLocationClick() {
    wx.chooseLocation({
      fail: (err) => {
        console.log(err);
      },
      success: (res) => {
        console.log(res);
        hasLoadAll.current = false;
        getLocationRef.current = {
          latitude: res.latitude,
          longitude: res.longitude,
          address: res.name,
        };
        getList(true);
      },
    });
  }

  return (
    <View>
      <>
        <Button onTap={getLocationClick}>选择定位</Button>
        <div className={s.newLocation}>当前定位：{currentLocation}</div>
      </>
    </View>
  );
}
export default duikou;
