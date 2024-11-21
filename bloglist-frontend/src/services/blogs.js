import axios from 'axios'
const baseUrl = '/api/blogs'

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = async (newObj,config) => {
  const res = await axios.post(baseUrl,newObj,config)
  return res.data
}

const update = async (id,toUpd,config) => {
  const res = await axios.put(`${baseUrl}/${id}`,toUpd,config)
  return res.data
}

const deleteBlog = async (id,config) => {
  const res = await axios.delete(`${baseUrl}/${id}`,config)
  return res.data
}

export default { getAll, create, update, deleteBlog }