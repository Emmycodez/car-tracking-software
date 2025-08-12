export const getStatusColor = (status: string) => {
    switch (status) {
      case "driving":
        return "green"
      case "stopped":
        return "blue"
      case "idling":
        return "orange"
      case "offline":
        return "red"
      default:
        return "gray"
    }
  }