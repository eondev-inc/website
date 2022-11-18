import { BlogEntry } from '@/interfaces/blog-entry.interface'

const useBlogs = () => {
  const blogEntries: BlogEntry[] = [
    {
      slug: 'first-post',
      title: 'La inteligencia artificial parece más inteligente',
      content: `Veniam culpa magna cupidatat deserunt exercitation
      fugiat deserunt fugiat in amet officia sunt laborum sunt. 
      Consequat quis elit occaecat dolor eiusmod laborum quis 
      incididunt dolore reprehenderit. Voluptate anim occaecat id 
      non sunt nostrud magna ex id fugiat consectetur laboris excepteur.`,
      resume: `Ipsum irure consequat occaecat consectetur nulla. Nostrud 
      Lorem enim laboris aliqua consequat Lorem sunt dolore irure consectetur
      eiusmod cillum.`,
      images: {
        title: 'first-post.svg'
      }
    },
    {
      slug: 'second-post',
      title: 'La inteligencia artificial parece más inteligente',
      content: `Veniam culpa magna cupidatat deserunt exercitation
      fugiat deserunt fugiat in amet officia sunt laborum sunt. 
      Consequat quis elit occaecat dolor eiusmod laborum quis 
      incididunt dolore reprehenderit. Voluptate anim occaecat id 
      non sunt nostrud magna ex id fugiat consectetur laboris excepteur.`,
      resume: `Ipsum irure consequat occaecat consectetur nulla. Nostrud 
      Lorem enim laboris aliqua consequat Lorem sunt dolore irure consectetur
      eiusmod cillum.`,
      images: {
        title: 'second-post.svg'
      }
    },
    {
      slug: 'third-post',
      title: 'La inteligencia artificial parece más inteligente',
      content: `Veniam culpa magna cupidatat deserunt exercitation
      fugiat deserunt fugiat in amet officia sunt laborum sunt. 
      Consequat quis elit occaecat dolor eiusmod laborum quis 
      incididunt dolore reprehenderit. Voluptate anim occaecat id 
      non sunt nostrud magna ex id fugiat consectetur laboris excepteur.`,
      resume: `Ipsum irure consequat occaecat consectetur nulla. Nostrud 
      Lorem enim laboris aliqua consequat Lorem sunt dolore irure consectetur
      eiusmod cillum.`,
      images: {
        title: 'third-post.svg'
      }
    }
  ]

  const filterBlog = (slug: string): BlogEntry[] => {
    return blogEntries.filter((b) => b.slug === slug)
  }

  return {
    blogEntries,
    filterBlog
  }
}

export default useBlogs
