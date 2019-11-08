/**
 * 判断数据类型
 * @author Luisa.Xiao
 * @param {*} value 
 * @param {Array,Number...} type 
 */
export default function isType(value, type){
 return type == Object.prototype.toString.call(value).slice(8,-1)
}