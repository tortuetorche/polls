/* jshint esversion: 6 */
/**
 * @copyright Copyright (c) 2018 Julius Härtl <jus@bitgrid.net>
 * @copyright Copyright (c) 2018 John Molakvoæ <skjnldsv@protonmail.com>
 *
 * @author Julius Härtl <jus@bitgrid.net>
 * @author John Molakvoæ <skjnldsv@protonmail.com>
 *
 * @license GNU AGPL version 3 or any later version
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 *
 */
import Vue from 'vue'
import Router from 'vue-router'

// Dynamic loading
const List = () => import('./views/PollList')
const Vote = () => import('./views/Vote')
const PublicVote = () => import('./views/PublicVote')

Vue.use(Router)

export default new Router({
	mode: 'history',
	base: OC.generateUrl(''),
	linkActiveClass: 'active',
	routes: [
		{
			path: '/:index(index.php/)?apps/polls/:type?',
			components: {
				default: List
			},
			props: true,
			name: 'list'
		},
		{
			path: '/:index(index.php/)?apps/polls/vote/:id',
			components: {
				default: Vote
			},
			props: true,
			name: 'vote'
		},
		{
			path: '/:index(index.php/)?apps/polls/vote/:id',
			components: {
				default: Vote
			},
			props: true,
			name: 'clone'
		},
		{
			path: '/:index(index.php/)?apps/polls/vote/:id',
			components: {
				default: Vote
			},
			props: true,
			name: 'create'
		},
		{
			path: '/:index(index.php/)?apps/polls/s/:token',
			components: {
				default: PublicVote
			},
			props: true,
			name: 'publicVote'
		}
	]
})
