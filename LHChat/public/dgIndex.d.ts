import * as React from "react";
import { type } from "os";

// alert 提示框
type alertCallback = (index:number,alert:DGAlertView)=> void;

declare class DGAlertView extends React.Component{
    /**显示AlertView */
    static show : ({title:string,message:string,actions:Array,options:alertViewOptions,onPress:alertCallback}) =>DGAlertView;
    show : ({title:string,message:string,actions:Array,options:alertViewOptions,onPress:alertCallback}) =>DGAlertView;

    /**关闭AlertView */
    dismiss : ()=>void;
}

export interface alertViewOptions {
    messageFontSize: number,
    tintColor:string
}

// sheet 选择框
type sheetCallback = (index:number)=> void;

declare class DGSheetView extends React.Component{
    /**显示SheetView */
    static show :({title:string,actions:Array,onPress:sheetCallback}) => DGSheetView;
    show :({title:string,actions:Array,onPress:sheetCallback}) => DGSheetView;

    /**关闭SheetView */
    hidden : ()=>void;
}

