const createResponse = (data:object,message:string,error:string,total:number)=>
{
    const responseObj={
        data:{},
        message:'',
        error:'',
        meta:{}

    }
    responseObj["data"]=data;
    responseObj["message"]=message;
    responseObj["error"]=error;
    responseObj["meta"]={length:data instanceof Array?data.length:1,
                        tot:total};
    return responseObj;
}

export default createResponse;