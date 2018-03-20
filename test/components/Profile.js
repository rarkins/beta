import { mount, createStore, router } from 'helpers/client'
import Profile from '~/components/Profile'
import deepAssign from 'deep-assign'

function baseProfile(...obj) {
  return deepAssign(
    {
      id: 1,
      content: {
        cover_image: {
          link: 'https://example.com/cover.png',
          width: 960,
          height: 640
        },
        avatar_image: {
          link: 'https://example.com/avatar.png',
          width: 128,
          height: 128
        }
      },
      counts: {
        posts: 1,
        following: 2,
        followers: 3,
        bookmarks: 4
      },
      follows_you: false
    },
    ...obj
  )
}

describe('Profile component', () => {
  let profile
  let opts
  let store
  let wrapper

  beforeEach(() => {
    store = createStore()
    store.commit('SET_USER', { username: 'foo', id: 1 })
    profile = baseProfile()
    opts = { propsData: { profile }, store, attachToDocument: true, router }
    wrapper = mount(Profile, opts)
  })
  describe('Cover', () => {
    it('Show cover image', () => {
      expect(wrapper.first('img').getAttribute('src')).to.have.string(
        'cover.png'
      )
    })
    it('comptued headerHeight', () => {
      expect(wrapper.vm.headerHeight).to.be.above(0)
    })
  })
  describe('Userinfo', () => {
    it('Show a shield badge when verified domain', () => {
      wrapper.setProps({
        profile: baseProfile({
          verified: {
            domain: 'example.com',
            link: 'https://example.com'
          }
        })
      })
      expect(wrapper.contains('#profile-domain')).to.be.true
    })
    it('Hidden a shield badge when not verified domain', () => {
      expect(wrapper.contains('#profile-domain')).to.be.false
    })
    it('Show bio when content.text exists', () => {
      wrapper.setProps({
        profile: baseProfile({ content: { text: 'foo' } })
      })
      expect(wrapper.contains('.description')).to.be.true
    })
    it('Hidden bio when profile.text does not exist', () => {
      wrapper.setProps({
        profile: baseProfile()
      })
      expect(wrapper.contains('.description')).to.be.false
    })
  })
  describe('counts', () => {
    let text
    beforeEach(() => {
      text = wrapper.first('#profile-counts').text()
    })
    it('Posts', () => expect(text).to.have.string('1 Posts'))
    it('Follows', () => expect(text).to.have.string('2 Follows'))
    it('Followers', () => expect(text).to.have.string('3 Followers'))
    it('Stars', () => expect(text).to.have.string('4 Starred'))
  })
  describe('Me', () => {
    it('Not shown follow button', () => {
      expect(wrapper.contains('#profile-follow-button')).to.be.false
    })
  })
  describe('Everyone except me', () => {
    const others = baseProfile({ id: 2 })
    const extendOthers = (...obj) => baseProfile(others, ...obj)
    let $relation
    beforeEach(() => {
      wrapper.setProps({
        profile: others
      })
      $relation = wrapper.first('#profile-relation')
    })
    it('Show follow button', async () => {
      expect(wrapper.contains('#profile-follow-button')).to.be.true
    })
    it('relation is not shown when another user not follow you', () => {
      expect($relation.text().trim()).is.empty
    })
    it('relation is shown when another user follows you', () => {
      wrapper.setProps({
        profile: extendOthers({ follows_you: true })
      })
      expect($relation.text().trim()).to.equal('Follows you')
    })
  })
})
