
import React ,{Component} from 'react';

import {
    View,
    ART,
    Text
} from 'react-native';

const {Surface, Shape, Path} = ART;


export default class DGRefreshTop  extends Component{
    constructor(){
        super();
    }

    render(){

        const path = ART.Path();
        path.moveTo(1,1); //将起始点移动到(1,1) 默认(0,0)
        path.lineTo(300,1); //连线到目标点(300,1)

        return(
            <View style={{flex:1,justifyContent:'center',alignItems:'center',backgroundColor:'red'}}>
                <ART.Surface  style={{backgroundColor:'green'}} width={300} height={200}>
                    <ART.Shape d={path} stroke="#000000" strokeWidth={10} />
                </ART.Surface>
            </View>
        )
    }
}