import React, { PureComponent,Component } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Image,
    ART,
    Animated,
    Easing
} from 'react-native';
import PropTypes from 'prop-types';

// 将 ART.Surface 指定为自定义动画视图（Animated 默认只封装了Image、ScrollView、View、Text 的动画属性）
let SurfaceAnimationView = Animated.createAnimatedComponent(ART.Surface);

export default class DGButton extends Component{
    constructor(){
        super();
        this.state = {
            justifyContent:'center',
            alignItems:'center',
            arrangeType:'imageInFront',
            direction:'row',
        }
        //创建旋转动画
        this.rotateAnimation = new Animated.Value(0);
    }

    /**componentWillReceiveProps 将在未来的某个版本中取消。请使用下面的 static getDerivedStateFromProps 替代 */ 
    // componentWillReceiveProps(nextProps,nextContext){
    // }

    static getDerivedStateFromProps(nextProps,prevState){
        // 更改排序规则
        let  alignmentType = nextProps.alignmentType;
        let  arrangeType = nextProps.arrangeType;
        let state = {};

        if(alignmentType === 'center'){
            state = {
                justifyContent:'center',
                alignItems:'center'
            };
        }else if(alignmentType == 'top'){
            state = {
                justifyContent:'center',
                alignItems:'flex-start'
            };
        }else if(alignmentType == 'left'){
            state = {
                justifyContent:'flex-start',
                alignItems:'center'
            };
        }else if(alignmentType == 'bottom'){
            state = {
                justifyContent:'center',
                alignItems:'flex-end'
            };
        }else if(alignmentType == 'right'){
            state = {
                justifyContent:'flex-end',
                alignItems:'center'
            };
        }

        state.arrangeType =  arrangeType? arrangeType:'imageInFront';

        if(state.arrangeType == 'imageInFront')state.direction    = 'row';
        if(state.arrangeType == 'imageInback')state.direction     = 'row-reverse';
        if(state.arrangeType == 'imageInTop')state.direction      = 'column';
        if(state.arrangeType == 'imageInBottom')state.direction   = 'column-reverse';

        //此函数必须有返回值。返回的内容就是你想要修改的state信息
        return state;
    }

    donePress = (event)=>{
        let props = this.props;
        if(this.props.onPress)this.props.onPress(event,props);
    }

    // 无限旋转动画
    transformRotateAnimation = ()=>{
        // 设置映射
        let rotate = this.rotateAnimation.interpolate({
            inputRange: [0, 1],//输入值
            outputRange: ['0deg', '360deg'] //输出值
        });
        return rotate;
    }

    // 开始动画
    startRotateAnimation = ()=>{
        // 这里使用定时器，是因为在下面render方法中调用此函数时还没有渲染出来组件，需要使用setTimeout的特性（新的runloop），等待当前runloop运行完毕之后再执行下面的动画
        setTimeout(() => {
            // loop 循环动画只有一个config属性，循环次数:iterations,默认为-1 （无限循环）
            Animated.loop(
                Animated.timing(
                    this.rotateAnimation,
                    {
                        toValue:1,
                        duration:500,
                        easing: Easing.linear
                    },
                ),
                {iterations:-1}
            ).start();
        }, 0);
    }

    render(){
        if(this.props.loading){
            // 开始动画
            this.startRotateAnimation()

            // 创建绘制路径
            const path = ART.Path();
            path.moveTo(20,10).arc(0,20,10);// moveTo(20,10)移动之后arc()的坐标这里就是从这里按(0,0)开始算。和iOS中的不一样。

            return(
                <View style = {this.props.style} >
                    <SurfaceAnimationView width={40} height={40} style = {{transform: [{rotate:this.transformRotateAnimation()}]}}>
                        <ART.Shape d={path} stroke="#000000" strokeWidth={1} />
                    </SurfaceAnimationView>
                </View>
            );
        }

        return(
            <TouchableOpacity style = {this.props.style} 
                              onPress = {this.donePress} 
                              underlayColor = 'transparent' 
                              activeOpacity = {0.45}
                              >

              <View style = {[styles.mainView,{justifyContent:this.state.justifyContent,alignItems:this.state.alignItems,flexDirection:this.state.direction}]}>
                <Image  style = {[styles.image,{tintColor:this.props.tintColor,width:this.props.img?20:0,height:this.props.img?20:0,flexBasis:this.props.img?20:0}]}
                        source = {{uri:this.props.img}} 
                        resizeMode = 'contain' ></Image>

                <Text style = {[styles.text,{color:this.props.titleColor ,fontSize:this.props.titleFont}]}> {this.props.title} </Text>
              </View>
            </TouchableOpacity>
        );
    }

}

// 使用PropTypes 指定类型。这样可以规范代码。在超出规定返回时。编译器会警告提示
DGButton.propTypes = {
    arrangeType   : PropTypes.oneOf(['imageInFront','imageInback','imageInTop','imageInBottom']),
    alignmentType : PropTypes.oneOf(['center','top','left','bottom','right'])
};


const styles = StyleSheet.create(
    {
        mainView:{
            flex:1,
            justifyContent:'center',
            alignItems:'center',
            flexDirection:'row'
        },
        text:{
            color:'#999999',
            textAlign:'center',
            fontSize:13,
            padding:2
        },
        image:{
            height:20.0,
            width:20.0,
            flexBasis:20,
        }
    }
);