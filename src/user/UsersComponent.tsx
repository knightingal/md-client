import React from 'react'
import { useAppDispatch } from '../store'
import { useSelector } from 'react-redux'
import { updateUser } from './slice'
import type { User, UsersState } from './slice'


const UsersComponent = (props: {  }) => {
  const { entities, error } = useSelector((state: {users: UsersState}) => state.users)
  const dispatch = useAppDispatch()

  // This is an example of an onSubmit handler using Formik meant to demonstrate accessing the payload of the rejected action
  const handleUpdateUser = async (
    info: string
  ) => {
    dispatch(updateUser({ id: "0", info:info }))

    // const resultAction = await     // if (updateUser.fulfilled.match(resultAction)) {
    //   // user will have a type signature of User as we passed that as the Returned parameter in createAsyncThunk
    //   const user = resultAction.payload
    //   console.log('success', `Updated ${user.first_name} ${user.last_name} ${user.email}`)
    // } else {
    //   if (resultAction.payload) {
    //     // Being that we passed in ValidationErrors to rejectType in `createAsyncThunk`, those types will be available here.
    //     // formikHelpers.setErrors(resultAction.payload.field_errors)
    //   } else {
    //     console.error('error', `Update failed: ${resultAction.error}`)
    //   }
    // }
  }

  
  React.useEffect(() => {
    handleUpdateUser("eee")
  }, [])
  

  if (entities.length === 0) {
    return <h1>User</h1>
  } else {
    return <h1>{entities[0].first_name}</h1>
  }
  

  // render UI here
}

export default UsersComponent;