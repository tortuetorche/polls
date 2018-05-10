/**
 * @copyright 2017 Christoph Wurst <christoph@winzerhof-wurst.at>
 *
 * @author 2017 Christoph Wurst <christoph@winzerhof-wurst.at>
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
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 */

import Vue from 'vue';
import axios from 'axios';
import moment from 'moment';

import AuthorDiv from './components/authorDiv.vue';
import Breadcrump from './components/breadcrump.vue';
import DatePickerInline from './components/datePickerInline.vue';
import DatePickerInput from './components/datePickerInput.vue';
import DatePollItem from './components/datePollItem.vue';
import FiltersDate from './components/filtersDate.vue';
import SideBarClose from './components/sideBarClose.vue';
import TextPollItem from './components/textPollItem.vue';

export class App {
	start() {
		Vue.mixin({
			methods: {
				t: function(app, text, vars, count, options) {
					return OC.L10N.translate(app, text, vars, count, options);
				},
				n: function(app, textSingular, textPlural, count, vars, options) {
					return OC.L10N.translatePlural(app, textSingular, textPlural, count, vars, options);
				}
			}
		});

		let newPoll = new Vue({
			el: '#app',
			data: {
				poll: {
					mode: 'create',
					event: {
						id: 0,
						hash: '',
						type: 'datePoll',
						title: '',
						description: '',
						owner:'',
						created: '',
						access: 'public',
						expiration: false,
						expire: null,
						isAnonymous: false,
						fullAnonymous: false,
						disallowMaybe: false,
					},
					options: {
						pollDates: [],
						pollTexts:[]
					}
				},
				lang: 'de', //lang: OC.getLocale(),
				localeData: moment.localeData(moment.locale('de')), // localeData: moment.localeData(moment.locale(OC.getLocale())),
				placeholder: '',
				newPollDate: '',
				newPollTime: '',
				newPollText: '',
				nextPollDateId: 0,
				nextPollTextId: 0,
				protect: false,
				sidebar: false,
				titleEmpty: false
			},
			components: {
				'author-div': AuthorDiv
				'breadcrump': Breadcrump
				'date-picker-inline': DatePickerInline
				'date-picker-input': DatePickerInput
				'date-poll-item': DatePollItem
				'filtersDate': FiltersDate
				'side-bar-close': SideBarClose
				'text-poll-item': TextPollItem
				'time-picker': TimePicker
			} 
			mounted: function() {
				this.poll.event.hash = document.getElementById("app").getAttribute("data-hash"); 
				if (this.poll.event.hash !== '') {
					this.loadPoll(this.poll.event.hash);
					this.protect = true;
					this.poll.mode = 'edit';
				}
			},
			
			computed: {
				title: function () {
					if (this.poll.event.title === '') {
						return t('poll','Create new poll');
					} else {
						return this.poll.event.title;
					}
				}
			},
			
			methods: {
				switchSidebar: function() {
					this.sidebar = !this.sidebar;
				},

				addNewPollDate: function (newPollDate, newPollTime) {
					if (newPollTime !== undefined) {
						this.newPollDate = moment(newPollDate +' ' + newPollTime);
					} else {
						this.newPollDate = moment(newPollDate);
					}
					this.poll.options.pollDates.push({
						id: this.nextPollDateId++,
						timestamp: moment(newPollDate).unix(),
					});
					this.poll.options.pollDates = _.sortBy(this.poll.options.pollDates, 'timestamp');
				},
				
				addNewPollText: function (newPollText) {
					if (newPollText !== null) {
						this.newPollText = newPollText;
					}
					this.poll.options.pollTexts.push({
						id: this.nextPollTextId++,
						text: this.newPollText
					});
					this.newPollText = '';
				},

				writePoll: function (mode) {
					if (mode !== '') {
						this.poll.mode = mode;
					}
					if (this.poll.event.title.length === 0) {
						this.titleEmpty = true;
					} else {
						this.titleEmpty = false;
						axios.post(OC.generateUrl('apps/polls/write'), this.poll)
							.then((response) => {
								this.poll.mode = 'edit';
								this.poll.event.hash = response.data.hash;
								this.poll.event.id = response.data.id;
								window.location.href = OC.generateUrl('apps/polls/edit/' + this.poll.event.hash);
							}, (error) => {
								console.log(error.response);
						});
					}
				},
				
				loadPoll: function (hash) {
					axios.get(OC.generateUrl('apps/polls/get/poll/' + hash))
					.then((response) => {
						var i;
						this.poll = response.data.poll;
						if (response.data.poll.event.type === 'datePoll') {
							for (i = 0; i < response.data.poll.options.pollTexts.length; i++) {
								this.addNewPollDate(new Date(moment.utc(response.data.poll.options.pollTexts[i].text)));
								// this.addNewPollDate(new Date(response.data.poll.options.pollTexts[i].text)  +' UTC');
							}
						this.poll.options.pollTexts = [];
						}
					}, (error) => {
						console.log(error.response);
					});
				}
			},
			
			filters: {
				localDateOnly: function (timestamp) {
					if (!timestamp) return '';
					if (!moment(timestamp).isValid()) return 'Invalid Date';
					if (timestamp <  999999999999) timestamp = timestamp *1000;
					return moment(timestamp).format('dddd[,] ll');
				},

				localYear: function (timestamp) {
					if (!timestamp) return '';
					if (!moment(timestamp).isValid()) return 'Invalid Date';
					if (timestamp <  999999999999) timestamp = timestamp *1000;
					return moment(timestamp).format('YYYY');
				},

				localMonthNameShort: function (timestamp) {
					if (!timestamp) return '';
					if (!moment(timestamp).isValid()) return 'Invalid Date';
					if (timestamp <  999999999999) timestamp = timestamp *1000;
					return moment(timestamp).format('MMM');
				},

				localDowShort: function (timestamp) {
					if (!timestamp) return '';
					if (!moment(timestamp).isValid()) return 'Invalid Date';
					if (timestamp <  999999999999) timestamp = timestamp *1000;
					return moment(timestamp).format('dd');
				},

				localDay: function (timestamp) {
					if (!timestamp) return '';
					if (!moment(timestamp).isValid()) return 'Invalid Date';
					if (timestamp <  999999999999) timestamp = timestamp *1000;
					return moment(timestamp).format('D');
				}

				localDayOrdinal: function (timestamp) {
					if (!timestamp) return '';
					if (!moment(timestamp).isValid()) return 'Invalid Date';
					if (timestamp <  999999999999) timestamp = timestamp *1000;
					return moment(timestamp).format('Do');
				}

				local: function (timestamp) {
					if (!timestamp) return '';
					if (!moment(timestamp).isValid()) return 'Invalid Date';
					if (timestamp <  999999999999) timestamp = timestamp *1000;
					return moment(timestamp).format('dddd[,] ll');
				}

				localTime: function (timestamp) {
					if (!timestamp) return '';
					if (!moment(timestamp).isValid()) return 'Invalid Date';
					if (timestamp <  999999999999) timestamp = timestamp *1000;
					return moment(timestamp).format('LT');
				}

				// UTC variants
				utcDateOnly: function (timestamp) {
					if (!timestamp) return '';
					if (!moment(timestamp).isValid()) return 'Invalid Date';
					if (timestamp <  999999999999) timestamp = timestamp *1000;
					return moment.utc(timestamp).format('dddd[,] ll');
				}

				utcTime: function (timestamp) {
					if (!timestamp) return '';
					if (!moment(timestamp).isValid()) return 'Invalid Date';
					if (timestamp <  999999999999) timestamp = timestamp *1000;
					return moment.utc(timestamp).format('LT');
				}

				utcFullDate: function (timestamp) {
					if (!timestamp) return '';
					if (!moment(timestamp).isValid()) return 'Invalid Date';
					if (timestamp <  999999999999) timestamp = timestamp *1000;
					return moment.utc(timestamp).format('llll');
				}
			}
			
		});
	}
}
