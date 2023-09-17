
// export declare const userAPI: {
//   updateById<Response>(id: string, fields: {}): { data: Response },

// }

const userAPI  = {
  updateById: <Response> (id:string, fields:{}) => {
    return new Promise<{data: Response}>((res, rej) => {
      return res({data: {
        user: {id: id, first_name:"name1", last_name:"name2", email:"1@2.com"},
        success: true
      } as Response})
    })
  }
}

export {userAPI}