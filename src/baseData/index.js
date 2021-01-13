const LOGINURL = {
  PRE: '/login/', // pre环境（本地用）
  // PRD: 'https://mtest.mingshiedu.com/apis/network-pre/' // pre地址 打包
  PRD: '/apis/network/', // 打包
  memberPRD: '/apis/network/memberservice/', // pre打包
  member: '/member/' // 本地pre
  // PRD: 'http://muat.mingshiedu.com:9127/apis/network/' // pre地址 打包
  // loginUrl: "/zuXin/",        //zuXin环境
  // loginUrl:"/loginUat", //uat环境（本地用）
  // loginUrl:"/jie", //（本地）
  // loginUrl:"/wei", //（本地）
  // loginUrl: "/prd", //（本地）
  // ajax_url:"http://192.168.1.67:8098/network/",         //uat环境
  // ajax_url: "https://m.mingshiedu.com/apis/network/",        //prd环境  上线
  // ajax_url: 'https://mtest.mingshiedu.com/apis/network-pre/', // pre环境  打包
}

const loginUrl =
  process.env.NODE_ENV === 'production' ? LOGINURL.PRD : LOGINURL.PRE

const MemberUrl =
  process.env.NODE_ENV === 'production' ? LOGINURL.memberPRD : LOGINURL.member

export { loginUrl, MemberUrl }
