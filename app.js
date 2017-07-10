'use strict';

// This is all the data objects that would be returned from a call to the backend
var articles = {
    'Tech': [
        {
            text: 'Today I am thrilled to announce the first public preview of Vue.js 2.0, which brings along many exciting improvements and new features.',
            interested: 'View the Vue',
            link: {
                href: 'https://vuejs.org/2016/04/27/announcing-2.0/'
            },
            author: 'vuejs.org',
            article: true,
            userMessage: false
        },
        {
            text: 'Paid plans on social-coding site GitHub now include unlimited private repositories as part of the deal. ',
            interested: 'Get Git',
            link: {
                href: 'http://www.infoworld.com/article/3069275/application-development/github-ushers-in-unlimited-private-repositories.html'
            },
            author: 'infoworld.com',
            article: true,
            userMessage: false
        }
    ],
    'Entertainment': [
        {
            text: 'The world\'s grumpiest law keeper is now taking aim at our TV screens as live-action series Judge Dredd: Mega City One is now in the works according to Entertainment Weekly.',
            interested: 'Judgement Time',
            link: {
                href: 'http://www.empireonline.com/movies/dredd/live-action-judge-dredd-tv-series-works/'
            },
            author: 'empireonline.com',
            article: true,
            userMessage: false
        },
        {
            text: 'Monster Hunter: World Looks Like An Amazing Game That Has No Idea What The Series Is All About',
            interested: 'Remember to bring whetstones',
            link: {
                href: 'https://www.forbes.com/sites/olliebarder/2017/07/08/monster-hunter-world-looks-like-an-amazing-game-that-has-no-idea-what-the-series-is-all-about/#532e73851077'
            },
            author: 'forbes.com',
            article: true,
            userMessage: false
        }
    ]
};

var categories = Object.getOwnPropertyNames(articles);

var introduction = [
    {text: 'Hey there!', author: 'RC', article: false, userMessage: false},
    {text: 'Welcome to Rock Crystal.', author: 'RC', article: false, userMessage: false},
    {text: 'We\'re definitely unrelated to any other apps named after minerals...', author: 'RC', article: false, userMessage: false},
    {text: 'Anyways... on to the news!', author: 'RC', article: false, userMessage: false},
    {text: 'First up is ' + Object.getOwnPropertyNames(articles)[0], author: 'RC', article: false, userMessage: false}
];


// The Vue compenent that drives the functionality
var mainNews = new Vue({
    el: '#main-news',
    data: {
        introduction: [],
        chatlog: [],
        categories: [],
        categoriesIndex: 0,
        articleQueue: [],
        articleQueueIndex: 0,
        interested: {text: '', author: 'me', article: false, userMessage: true},
        notInterested: {text: 'Anything else?', author: 'me', article: false, userMessage: true},
        prompt: {text: 'Got it.', author: 'me', article: false, userMessage: true},
        isQuestion: false,
        isPrompt: false
    },
    methods: {
        // This runs through the initial introduction messages
        giveIntroduction: function () {
            for (var i = 0; i < this.introduction.length; i++) {
                this.callMessageTimeout(i, this.introduction[i]);
            }
            setTimeout(function () {
                mainNews.isPrompt = true;
            }, this.introduction.length * 2000);
        },
        // Timeouts are used to add messages to simulate another user entering messages
        callMessageTimeout: function (i, message) {
            setTimeout(function() {
                mainNews.addNewMessage(message);
            }, i * 2000);
        },
        // These 3 get functions simulate calls to the backend for data
        getIntroduction: function () {
            return introduction;
        },
        getCategories: function () {
            return categories;
        },
        getArticles: function (category) {
            return articles[category];
        },
        addNewArticle: function () {
            // Check to see if we have reached the end of the articles for this category
            if (this.articleQueueIndex < this.articleQueue.length) {

                this.callMessageTimeout(1, this.articleQueue[this.articleQueueIndex]);
                // After the article has been queued to display, set the question text and display trigger
                setTimeout(function() {
                    mainNews.interested.text = mainNews.articleQueue[mainNews.articleQueueIndex].interested;
                    mainNews.isQuestion = true;
                    mainNews.articleQueueIndex++;
                }, 4000);
            // If the last article has been read, increment the categories index, pull new articles, reset article index, and run addNewArticle again
            } else if (this.categoriesIndex < this.categories.length - 1) {
                this.categoriesIndex++;
                this.callMessageTimeout(1, {text: 'And now for something completely different... ' + this.categories[this.categoriesIndex] + '!', author: 'RC', article: false, userMessage: false});
                this.articleQueue = this.getArticles(this.categories[this.categoriesIndex]);
                this.articleQueueIndex = 0;
                this.addNewArticle();
            // Else we have run through all categories and nothing left to display
            } else {
                this.callMessageTimeout(1, {text: 'And that is all the news fit to print.', author: 'RC', article: false, userMessage: false});
            }
        },
        // Chatlog array holds all messages, any new messages are added to the DOM
        addNewMessage: function (message) {
            this.chatlog.push(message);
        },
        nextArticle: function () {
            this.addNewArticle();
        },
        nextCategory: function () {
            this.articleQueueIndex = this.articleQueue.length;
            this.addNewArticle();
        },
        // Confirm functions display the users selected message
        // and then calls either nextArticle or nextCategory
        confirmPrompt: function (prompt) {
            this.isPrompt = false;

            this.callMessageTimeout(1, prompt);
            setTimeout(function() {
                mainNews.nextArticle();
            }, 4000);
        },
        confirmQuestion: function (answer) {
            this.isQuestion = false;

            if (answer === 'interested') {
                this.callMessageTimeout(1, Object.assign({}, this.interested));
                setTimeout(function() {
                    mainNews.nextArticle();
                }, 4000);
            } else {
                this.callMessageTimeout(1, Object.assign({}, this.notInterested));
                setTimeout(function() {
                    mainNews.nextCategory();
                }, 4000);
            }
        }
    },
    // When the Vue component is created, the introduction messages are retrieved and displayed
    created: function () {
        this.introduction = this.getIntroduction();
        this.giveIntroduction();
        this.categories = this.getCategories();
        this.articleQueue = this.getArticles(this.categories[this.categoriesIndex]);
    },
    // When a new message is displayed, window is scrolled to the newest message
    updated: function () {
        window.scrollTo(0,document.body.scrollHeight);
    }
});
