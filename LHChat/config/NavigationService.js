import { NavigationActions ,StackActions} from 'react-navigation';

let _navigator;

function setTopLevelNavigator(navigatorRef) {
  _navigator = navigatorRef;
}

// 推入指定路由
function navigate(routeName, params) {
  _navigator.dispatch(
    NavigationActions.navigate({
      routeName,
      params,
    })
  );
}

// 返回上一级
function goback(){
    _navigator.dispatch(NavigationActions.back());
}

// 重新压入新的堆栈。销毁之前的堆栈
function reset(routeName) {
    const resetAction = StackActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({routeName: routeName})]
    });
    _navigator.dispatch(resetAction);
}

export default {
  navigate,
  goback,
  reset,
  setTopLevelNavigator,
};