# Whenbot-alarm-server

该程序是示例程序，用于接受 `心知天气` Whenbot服务的预警消息。生产环境中使用时，请根据自己的需求进行修改。

需要配置接受全国的预警消息属于定制服务，不支持在 whenbot.com 网站上直接操作。
有此需求者，请联系 hi@seniverse.com 详谈

### 配置文件
`/src/config/env/`

根据需要修改不同环境下的配置文件，需要两个数据存储，一个是 MySQL, 一个是 Redis。
程序支持把接受到的消息放到 Redis 的三个 KEY 中：

```
XZ_ALARM_<v3> 某个城市的预警
XZ_ALARM_ALL 当前有效的预警列表
XZ_ALARM_LIST 当前有效的预警列表(兼容需要，格式不同)
```

以及数据库的 `xz_alarm` 表中

该格式设计主要为了兼容 `心知` 官方 API 服务的字段要求。
用户可以根据需求，结合 whenbot.com 上游的传入数据，进行修改。

### webhook 地址
`http://{ServerIp}:{Port}/api/v1/webhook`

### 安装说明

nodejs版本要求: v10以上

```
git clone http://github.com/seniverse/whenbot-alarm-server.git
cd whenbot-alarm-server
npm install
npm build
node  dist/index.js
```

可以根据需要使用 forever 或者 pm2 来进行生产环境的部署

### 推送过来的预警数据格式

```
{
  "id": "cee90820-cee2-11e9-a84b-45ccc2575608",
  "type": "event",
  "triggerId": "ATUD7C4gL",
  "name": "全量天气预警",
  "success": true,
  "datetime": "2019-09-04T15:08:33+08:00",
  "location": {
    "v3": "000000",
    "name": "全国",
    "id": "000000",
    "latitude": "0",
    "longitude": "0",
    "path": "全国"
  },
  "data": [
    {
      "success": true,
      "rule": [
        "alarm"
      ],
      "data": [
        {
          "imageUrl": "https://static.sencdn.com/alarm-images-v2/11B14-yellow-alarm.png?156758091135",
          "id": "ad68280b-8c25-487a-8171-9d72358435f2",
          "text": "元谋县气象台2019年9月4日14时55分发布雷电黄色预警信号:预计未来12小时内我县境内将出现雷电活动，并局地伴有短时强降水、大风、冰雹等强对流天气，请注意防范。",
          "title": "元谋县气象台发布雷电黄色预警[Ⅲ级/较重]",
          "sender": "元谋县气象台",
          "colorCode": "yellow",
          "colorText": "黄色",
          "eventName": "雷电事件",
          "eventId": "11B14",
          "regionId": "532328",
          "locationV3": "WK86NQDC254P",
          "identifier": "53232841600000_20190904150413",
          "date": "2019-09-04T15:04:13+08:00",
          "expiredAt": "2019-09-06T03:04:13+08:00",
          "references": "",
          "status": "ALERT"
        }
      ]
    }
  ]
}
```

主要字段在 data.data[] 中， 一般为一条，但结构支持多条的可能性。各子字段说明如下：

```
* imageUrl, 参考图片
* id, 内部标识
* text, 预警正文
* title, 预警标题
* sender, 预警发布者
* colorCode 预警颜色（英文）
* colorText 预警颜色（中文）
* eventName, 预警类型名称
* eventId, 预警类型标识
* regionId, 城市标识（国家标准）
* locationV3, 城市标识（心知 v3 标识）
* identifier, 预警编号
* date, 发布时间
* expiredAt, 过期时间
* references, 关联预警编号
* status, 预警状态，有ALTER, CANCEL, UPDATE几种
```
