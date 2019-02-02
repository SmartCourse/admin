export function makeFrontendPath(
  code,
  parentType,
  questionID,
  reviewID,
  commentID
) {
  // note that currently in the frontend there's no way to view an individual comment, so we just link to the parent
  const [parentParentType, parentParentID] = questionID
    ? ['question', questionID]
    : ['review', reviewID]
  return `course/${code}/${parentParentType}/${parentParentID}`
}

export function makeServerPath(
  code,
  parentType,
  questionID,
  reviewID,
  commentID
) {
  const [parentParentType, parentParentID] = questionID
    ? ['question', questionID]
    : ['review', reviewID]
  if (parentType === 'comment') {
    const commentType = questionID ? 'answer' : 'comment'
    return `api/course/${code}/${parentParentType}/${parentParentID}/${commentType}/${commentID}`
  }
  return `api/course/${code}/${parentParentType}/${parentParentID}`
}
