<script>
import Sidebar from './Sidebar'

export default {
  extends: Sidebar,
  computed: {
    menus() {
      const { q } = this.$route.query
      return [
        { type: 'heading', label: 'Search' },
        {
          label: 'Posts',
          icon: 'list',
          url: `/search/posts?q=${encodeURIComponent(q)}`
        },
        {
          label: 'Users',
          icon: 'users',
          url: `/search/users?q=${encodeURIComponent(q)}`
        }
      ]
    }
  }
}
</script>
