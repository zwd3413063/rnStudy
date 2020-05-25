import {lh_image_base_url} from 'dg-config/DGGlobal'

export default class LHUserInfo{
    /*
NSString * ID;                // 用户ID
NSString * createTime;
BOOL isValid;                 // 是否有效
NSString *phone;              // 手机号
NSString *pwd;                // 密码


LHGenderType sex;             // 性别
NSString *openid;             // 第三方登录ID
NSString *pic;                // 头像名
NSString *picPath;            // 头像地址

NSString *nickname;           // 昵称
int age;                      // 年龄
NSString *career;             // 职业
NSString *datingRange;        // 约会范围(存在多个时使用,分割)
NSString *channel;            // 渠道
NSString *introduction;       // 简介QQ

BOOL showQQ;                  // 是否显示QQ（未支付的为NO）
BOOL showWechat;              // 是否显示微信（未支付的为NO）
NSString *qq;                 // QQ 号码
NSString *wechat;             // 微信号码
double wechatMoney;           // 微信价格
double qqmoney;               // QQ价格

NSString *datingProgram;      // 约会节目(存在多个时使用,分割)
NSString *datingCondition;    // 约会条件(存在多个时使用,分割)
NSString *height;             // 身高
NSString *bust;               // 胸围
NSString * weight;            // 体重
LHAccountVerifiType state;    // 认证类型
NSTimeInterval updateTime;    // 上次登录时间
NSString *updateUser;         // 更新人
BOOL isShowData;              // 是否申请查看，YES 允许查看，NO申请查看
NSString *remark;             // 备注
NSString *longitude;          // 经度
NSString *latitude;           // 纬度
NSString *address;            // 地址
BOOL isQuality;               // 是否为优质客户
NSMutableArray <LHImageModel>*images;  // 相册

@property (strong , nonatomic,readonly)NSArray <NSURL*>*imageURLs;   // 相册URLs
@property (strong , nonatomic,readonly)NSURL *picURL;                // 头像地址（本地解析）
@property (strong , nonatomic,readonly)NSURL *picSmallURL;           // 头像小图地址（本地解析）

BOOL isVip;                   // 是否为VIP
NSTimeInterval endTime;       // VIP 过期时间
NSString *city;
NSInteger visitorCount;       // 访客数量
NSInteger redBurnCount;       // 阅后即焚数量
NSArray <LHUserEvaluateModel>*comments; // 评论数
distance;                     // 距离（米）
collect;                      // 是否收藏
showPhoto;                    // 是否公开相册
photoMoney;                   // 相册价格
redPacketMoney;               // 红包照片价格
blacklist;                    // 是否为黑名单
inviteCode;                   // 我的邀请码
stateTxt;                     // 认证状态说明
stateImage;                   // 认证状态图片
qualityType;                  // 用户质量
qualityCornerImage;           // 用户质量角标图
    */
    constructor(data){
        //原型复制，将data的属性全部赋值给this
        // Object.setPrototypeOf(this, data);  找个不行。会改变this的指向
        let propertys = Object.getOwnPropertyNames(data);
        // 这里是for of 不是 for in 看清楚了。for of其实才是和oc中的for in功能相同
        for (const name of propertys) {
            this[name] = data[name];
        }
    }

    // 相册数组
    get imageModels(){
        let imageModels = [];
        if (!this.images)return imageModels;
        
        for (const imageObject of this.images){ 
                let filePath = imageObject.files? imageObject.files.filePath:'';
                imageObject.uri = lh_image_base_url + filePath;
                imageModels.push(imageObject);
        }
        return imageModels;
    }
}
