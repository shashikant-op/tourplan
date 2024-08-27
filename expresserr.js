class expresserr extends Error{
   constructor(statuscode,message){
      super();
      this.status=statuscode;
      this.message=message;
   }
}

module.exports=expresserr;