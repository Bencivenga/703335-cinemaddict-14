import { getUniqueValues } from "./common";

export const sortCommentsByDate = (comments) => {
  return comments.sort((a, b) => a.date < b.date ? -1 : 1);
};

export const createCommentTemplate = (comments) => {
  return comments ? comments.map(({id, author, comment, date, emoji}) => `<li class="film-details__comment" id="${id}">
            <span class="film-details__comment-emoji">
              <img src="./images/emoji/${emoji}.png" width="55" height="55" alt="emoji-${emoji}">
            </span>
            <div>
              <p class="film-details__comment-text">${comment}</p>
              <p class="film-details__comment-info">
                <span class="film-details__comment-author">${author}</span>
                <span class="film-details__comment-day">${date}</span>
                <button class="film-details__comment-delete">Delete</button>
              </p>
            </div>
          </li>`).join('') : '';
};

export const commentCountTemplate = (comments) => {
  let commentOutput = '';
  const commentsLength = comments.size;
  commentsLength === 1 ? commentOutput = commentsLength + ' comment' :
    commentOutput = commentsLength + ' comments';

  return commentOutput;
};
