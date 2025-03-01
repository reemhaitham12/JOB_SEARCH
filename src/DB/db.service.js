export const create=async({model,data={}}={})=>{
    const document = await model.create(data);
    return document
}

// findOne
export const findOne= async({model,filter={},select="",populate=[]}={})=>{
    const document= await model.findOne(filter).select(select).populate(populate);
    return document;
}

// updateOne
export const updateOne= async({model,filter={},data={},options={}}={})=>{
    const document= await model.updateOne(filter,data,options);
    return document;
}

// findByIdAndUpdate
export const findByIdAndUpdate=async({model,id="",data={},options={},select="",populate=[]}={})=>{
    const document= await model.findByIdAndUpdate(id,data,options).select(select).populate(populate);
    return document;
}