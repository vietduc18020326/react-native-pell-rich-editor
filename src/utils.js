// return headings (<h2></h2>, <h1></h1>, ...)
const headingTagRex = /<\s*\/?h\d*>/g;

// return content between opening headings (<h1>, <h2>, ...)
const contentBetweenOpenTagRex = /<h\d>((?!<\/h\d>).|\n)*?<h\d>/g;

// return content between closing headings (</h1>, </h2>, ...)
const contentBetweenCloseTagRex = /<\/h\d>((?!<h\d>).|\n)*?<\/h\d>/g;

String.prototype.replaceBetween = function (start, end, content) {
    return this.substring(0, start) + content + this.substring(end);
};

function onCleanHeadingTags(re, html, isCloseTag) {
    while (html.match(re)) {
        let match = re.exec(html);
        while (match) {
            if (match?.[0] && match.index) {
                const index = match?.index;
                const last = index + match?.[0].length;
                let itemText = match[0];

                if (isCloseTag) {
                    const itemTag = itemText.substring(0, 5);
                    itemText = itemText.replace(headingTagRex, '') + itemTag;
                } else {
                    const itemTag = itemText.substring(
                        itemText.length - 4,
                        itemText.length,
                    );
                    itemText = itemTag + itemText.replace(headingTagRex, '');
                }

                html = html.replaceBetween(index, last, itemText);
                match = re.exec(html);
            }
        }
    }
    return html;
}

export const onCleanHTMLHeadings = (content) => {
    let newText = content;
    const reOpen = new RegExp(contentBetweenOpenTagRex);
    const reClose = new RegExp(contentBetweenCloseTagRex);
    newText = onCleanHeadingTags(reOpen, newText);
    newText = onCleanHeadingTags(reClose, newText, true);
    return newText;
};