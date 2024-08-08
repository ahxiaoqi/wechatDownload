import axios from 'axios';
import { StrUtil } from './utils';
import md5 from 'blueimp-md5';

interface Translator {
  /**
   * 翻译
   * @param transStr
   * @param appid
   * @param secretKey
   * @param from
   * @param to
   * @param completeCallBack
   */
  translate(transStr: string, appid: string, secretKey: string, from: string, to: string, completeCallBack: TranslateCompleteCallBack): Promise<void>;
}

interface TranslateCompleteCallBack {
  /**
   * 翻译完的回调
   * @param transStr
   * @param result
   */
  (transStr: string, result: string): void;
}

/**
 * 百度翻译
 */
class BaiduTranslator implements Translator {
  async translate(transStr: string, appid: string, secretKey: string, from: string, to: string, completeCallBack: TranslateCompleteCallBack): Promise<void> {
    const salt = StrUtil.randomStr();
    const str2sign = `${appid}${transStr}${salt}${secretKey}`;
    const sign = md5(str2sign).toString();
    const encodeTransStr = encodeURIComponent(transStr);
    const apiUrl = `http://api.fanyi.baidu.com/api/trans/vip/translate?q=${encodeTransStr}&from=${from}&to=${to}&appid=${appid}&salt=${salt}&sign=${sign}`;
    await axios({
      method: 'get',
      url: apiUrl
    }).then((res) => {
      if (res.data.trans_result && res.data.trans_result.length > 0) {
        // console.log(res.data.trans_result[0].dst);
        completeCallBack(transStr, res.data.trans_result[0].dst);
      }
    });
  }
}

export { BaiduTranslator };
export type { TranslateCompleteCallBack };

