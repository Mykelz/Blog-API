// // // // write a function that tales an array of integers, 
// // // // returns true if a value appears 2ce and false if every elememt is unique

// // // // const array = (arrayOfInt)=>{
// // // //     let i = 0;
// // // //     let a = {};
// // // //     while(i < arrayOfInt.length){
// // // //         console.log(a[arrayOfInt[i]])
// // // //         console.log(a);
// // // //         if (a[arrayOfInt[i]]){
// // // //             return true
// // // //         }
// // // //         a[arrayOfInt[i]] = true
// // // //         i++
// // // //     }
// // // //     return false
// // // // }
// // // // const arrayInt = [1,2,3,5,6]

// // // // const aInt = array(arrayInt);
// // // // console.log(aInt)

// // // // Input: arr = [0,10,20,30], fn = function greaterThan10(n) { return n > 10; }
// // // // Output: [20,30]
// // // // Explanation:
// // // // const newArray = filter(arr, fn); // [20, 30]
// // // // The function filters out values that are not greater than 10

// // // var filter = function(arr, fn) {
// // //      let i = 0;
// // //      const array = []
// // //      while(i < arr.length){
// // //         if (fn(arr[i], i)){
// // //             array.push(arr[i])
// // //         }
// // //         i++
// // //      }
// // //      return array
// // // };

// // // const arry = [0,10,20,30]
// // // function fn(n,i){
// // //      return n > 10; 
// // //     }

// // // const cstfilter = filter(arry, fn)
// // // console.log(cstfilter)


// // // var createCounter = function(init) {
// // //     let a = init
// // //     return {
// // //         increment: ()=> a++ ,
// // //         decrement: ()=> a--,
// // //         reset: ()=> a
// // //     }
// // // }; 

// // // const counter = createCounter(5)
// // // console.log(counter.increment())// 6
// // // console.log(counter.reset()); // 5
// // // console.log(counter.decrement()) // 4
 
// // var chunk = function(arr, size) { 
// //     let emptArr = []
// //     let i = 0;
// //     let j = size;
// //     while(i< arr.length){
// //        const inarr = arr.slice(i, j)
// //        emptArr.push(inarr)
// //         i = i + size
// //         j = j + size
// //     }
// //    return emptArr
// // }


// // const arr = []
// // const arrayC = chunk(arr,1)
// // console.log(arrayC)

// function newF() {
//     const newV = 5
// }

// function newT(){
//     if ( newV != undefined){
//         console.log(newV)
//     }
//     console.log(newV +  'is a local scoped variable' )
// }