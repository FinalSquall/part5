const Notification = ({ info }) => {
  if (!info.message) {
    return
  }

  const style = {
    color: info.type==='error' ? 'red' : 'green',
    background: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10
  }

  return (
    <div className="notification" style={style}>
      {info.message}
    </div>
  )
}

export default Notification