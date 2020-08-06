import Vue from 'vue'
// 导入 element 表单 按钮 表单元素 input框 消息提示框
import { Button, Form, FormItem, Input, Message } from 'element-ui'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.prototype.$Message = Message
