import { useEffect } from 'react'

function DocumentTitle(title) {

  useEffect(() => {
    document.title = title + ' | ' + "Parcel Express";
  }, [title]);
}
export default DocumentTitle