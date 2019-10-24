
import React ,{Component} from 'react';

import {
    View,
    FlatList,
    Text,
    StyleSheet
} from 'react-native';

import RefreshBottom from './DGRefreshBottom';

const PullUpStatusText = {
    refreshing  : "正在请求下拉刷新数据，请稍后再试!",
    pullUping   : "正在加载更多...",
    noMore      :"已经到底了，没有更多了!",
    failed      :"加载失败，请重新获取!",
    finished    :"加载完成!"
}

export default class DGRefreshList  extends Component{
    constructor(){
        super();
        this.state = {
            refreshing : false,
            bottomLoadText :PullUpStatusText.noMore,
            bottomLoadStatus:false
        }

        // 是否还有加载更多
        this.isNoMore = false;
        // 是否正在加载更多
        this.pullUping = false;
    }

    // 下拉刷新
    onRefresh = ()=>{
        // 正在刷新时不可操作
        if(this.state.refreshing)return;
        if(this.props.onRefresh)this.props.onRefresh();
        this.setState((state)=>({
            refreshing:true,
            bottomLoadText:PullUpStatusText.refreshing,
            bottomLoadStatus:false
        }));
    }

    // 上拉加载
    pullUp = ()=>{
        // 如果正在下拉刷新操作，这个时候不可以上拉加载更多
        if(this.state.refreshing){
            this.setState({bottomLoadText:PullUpStatusText.refreshing});
            return;
        }

        // 正在加载更多数据
        if(this.pullUping)return;
        
        //没有更多了
        if(this.isNoMore){
            this.setState({
                bottomLoadStatus:false,
                bottomLoadText:PullUpStatusText.noMore
            });
            return;
        }

        // 触发上拉加载更多
        if(!this.state.bottomLoadStatus){
            this.setState({
                bottomLoadStatus:true,
                bottomLoadText:PullUpStatusText.pullUping
            });
            console.log('我要加载啦！');
            if(this.props.onEndReached)this.props.onEndReached();
        }
    }

    // 滚动进行时，每一帧最多触发一次
    onScroll =({nativeEvent}) =>{
        let contentSizeHeight = nativeEvent.contentSize.height;
        let bottomOffet = nativeEvent.contentOffset.y + nativeEvent.layoutMeasurement.height;
        // 滑动到了底部
        if(bottomOffet >= contentSizeHeight){
            this.pullUp();
            this.pullUping = true;
        }
    }
    // 加载完成
    reloadData = ({isFail = false,noMore = false,text = ''} = {})=>{
        this.isNoMore = noMore;

        let bottomText  = isFail?  PullUpStatusText.failed:PullUpStatusText.finished;
        bottomText      = noMore?  PullUpStatusText.noMore:bottomText;
        bottomText      = text.length?  text:bottomText;

        this.setState({
            refreshing:false,
            bottomLoadStatus:false,
            bottomLoadText:bottomText
        });

        /*为啥这里要用个定时器，是因为数据加载更多完成后。contentSize发生变化还会触发一次onScroll函数。
        这样就导致加载更多的函数会触发两次。所以使用定时器，是为了再组件完成更新后，再去改变pullUping的状态,就不会有这个问题了
        */
        setTimeout(() => {
            this.pullUping = false;
        }, 0);
    }

    // 使系统自带的onEndReached失效，系统自带这个滑动到底部函数有问题
    loseOnEndReached = ()=>{

    }

    render(){
        return (
            <View style ={{flex:1}}>

                <FlatList {...this.props}
                    onRefresh = {this.onRefresh}
                    refreshing = {this.state.refreshing}
                    onScroll = {this.onScroll}
                    onEndReached = {this.loseOnEndReached}
                    ListFooterComponent = {(<RefreshBottom style = {{height:50}}
                                                           text = {this.state.bottomLoadText}
                                                           status = {this.state.bottomLoadStatus}
                                                            />
                                           )}
                />
            </View>
        )
    }
}
