import RNLocation from 'react-native-location'; // 定位功能


let _locationInfo = null;

export default class Location{
    constructor(){
        locatoinObject =  this;
    }

    static fetch = (callback)=>{
        // 如果有位置信息，就直接返回了
        if(_locationInfo){
            if(callback)callback(_locationInfo,null);
            return;
        }

        let isFetched = false;  // 避免多次调用成功回调

        // 获取定位信息
        RNLocation.configure({
            // allowsBackgroundLocationUpdates: true, // 打开后台定位。同时别忘记了在xcode中打开项目的后台开关
            distanceFilter: 100.0 // 最小更新距离依据（米）
          })

        // 发起定位          
        RNLocation.requestPermission({
            ios: "whenInUse", //  or 'always'
            android: {
              detail: "coarse" // or 'fine' ，如果你需要使用fine 那就必须在 AndroidManifest.xml 中，配置这一行<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION"/>
            }
        }).then(granted => {
              if (granted) {
                const unsubscribe = RNLocation.subscribeToLocationUpdates(locations => {
                    // 获取定位信息成功
                    if(locations.length > 0){
                        if (!isFetched){
                            isFetched = true;
                            _locationInfo = locations[0];
                            if(callback)callback(_locationInfo,null);
                        }
                    }else{
                        const error = Error('经纬度信息获取失败');
                        if(callback)callback(null,error);
                    }
                })
              }else{
                  const error = Error('经纬度信息获取失败');
                  if(callback)callback(null,error);
              }

        }).catch((e)=>{
            if(callback)callback(null,e);
        });
    }

    // 监听位置变化
    static updateLocationListen = ({listener},callback)=>{

    }

}