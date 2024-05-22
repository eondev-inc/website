const useBlogs = () => {
  const retrievePost = async (perPage: number) => {
    const techUrl = `https://techcrunch.com/wp-json/wp/v2/posts?per_page=${perPage}&context=embed`
    console.log(techUrl)

    return await fetch(techUrl)
  }

  return { retrievePost }
}

export default useBlogs
