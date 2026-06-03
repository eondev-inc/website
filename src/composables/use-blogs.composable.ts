const useBlogs = () => {
  const retrievePost = async (perPage: number) => {
    const baseUrl = import.meta.env.VITE_API_BLOG_URL || 'https://techcrunch.com/wp-json/wp/v2/posts'
    const url = `${baseUrl}?per_page=${perPage}&context=embed`
    console.log('Fetching posts from:', url)

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        mode: 'cors'
      })

      if (!response.ok) {
        console.error(`HTTP error! status: ${response.status}`)
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return response
    } catch (error) {
      console.error('Error fetching posts:', error)
      throw error
    }
  }

  return { retrievePost }
}

export default useBlogs
