 import Student from "../models/student.js"  
  
  
  export function getStudents(req,res){
         Student.find().then(
    (studentlist)=>{
res.json({
     list: studentlist
})
    }
   )

    }
  
     export function createStudent(req,res){
        console.log(req.user)

        if(req.user==null){
         res.json({
            message:"you are not login in"
         })
         return
        }

        if(req.user.type!="admin"){
             res.json({
            message:"you are not admin"
         })
         return
        }

         const newstudent=new Student(req.body)
      newstudent.save().then(
        ()=>{
            res.json({
                message:"students created"
            }
       ) }
      )
  }