import React, { PureComponent,Component } from 'react';
import {View,Text,TouchableOpacity,StyleSheet,Image} from 'react-native';
import PropTypes from 'prop-types';


export default class DGButton extends Component{
    constructor(){
        super();
        this.state = {
            justifyContent:'center',
            alignItems:'center',
        }
    }

    /**componentWillReceiveProps 将在未来的某个版本中取消。请使用下面的 static getDerivedStateFromProps 替代 */ 
    // componentWillReceiveProps(nextProps,nextContext){
    // }

    static getDerivedStateFromProps(nextProps,prevState){
        // 更改排序规则
        let  alignmentType = nextProps.alignmentType;
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

        //此函数必须有返回值。返回的内容就是你想要修改的state信息
        return state;
    }

    donePress = (event)=>{
        let props = this.props;
        if(this.props.onPress)this.props.onPress(event,props);
    }

    render(){
        return(
            <TouchableOpacity style = {this.props.style} 
                              onPress = {this.donePress} 
                              underlayColor = 'transparent' 
                              activeOpacity = {0.45}
                              >

              <View style = {[styles.mainView,{justifyContent:this.state.justifyContent,alignItems:this.state.alignItems}]}>
                <Image  style = {[styles.image,{tintColor:this.props.tintColor,width:this.props.img?20:0,height:this.props.img?20:0,flexBasis:this.props.img?20:0}]}
                        source = {{uri:this.props.img}} 
                        resizeMode = 'contain' ></Image>

                <Text style = {[styles.text,{color:this.props.tintColor ,fontSize:this.props.titleFont}]}> {this.props.title} </Text>
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
            fontSize:13
        },
        image:{
            height:20.0,
            width:20.0,
            flexBasis:20,
        }
    }
);