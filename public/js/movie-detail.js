$(document).ready(function () {
  let skipPage = 10
  $('.commentOfUser').slice(0, skipPage).show()
  let pageNo = $('#loadMore').data('pageno')
  let movieId = $('#vote-btn').data('idmovie')
  let userLoginId = $('#vote-btn').data('userid')
  //---------------------- get value rating check:----------------------
  const getValueRating = () =>
    $.ajax({
      url: `/api/users/ratings/${movieId}`,
      type: 'GET',
    }).done((data) => {
      if (data.data) {
        $(`input[name=rating][value='${data.data.score}']`).prop(
          'checked',
          true,
        )
        $('#vote-btn').text('Revote')
      } else {
        $(`input[name=rating][value='0']`).prop('checked', true)
      }
    })
  if (userLoginId) {
    getValueRating()
  }

  //---------------------- get total comment and total Rating of Movie:----------------------
  const getTotalCommentAndRating = () =>
    $.ajax({
      url: `/api/movies/${movieId}/info`,
      type: 'GET',
    }).done((data) => {
      $('#totalRating').text(`${data.data.countRatings} voters`)
      $('#totalComment').text(`${data.data.countComments}`)
      if (data.data.reviewScore) {
        $(`input[name=review-score][value='${data.data.reviewScore}']`).prop(
          'checked',
          true,
        )
      }
    })

  getTotalCommentAndRating()
  // ----------------------ajax post ratings----------------------
  $('#vote-btn').on('click', function (e) {
    e.preventDefault()
    if (!userLoginId) {
      toast({
        title: 'Error',
        message: 'You must login to do this action!',
        type: 'error',
        duration: 3000,
      })
      return
    }
    let ratingValue = $('input[name=rating]:checked').val()
    if (!ratingValue) {
      toast({
        title: 'Warning',
        message: 'You must vote score of movie before do this action!',
        type: 'warning',
        duration: 3000,
      })
      return
    }
    let ratingData = {
      movie_id: +movieId,
      score: +ratingValue,
    }
    $.ajax({
      url: '/api/users/ratings',
      type: 'POST',
      data: JSON.stringify(ratingData),
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
    })
      .done(() => {
        toast({
          title: 'Success',
          message: 'You have already rated this movie!',
          type: 'success',
          duration: 3000,
        })
        getValueRating()
        getTotalCommentAndRating()
      })
      .fail((err) => {
        console.log(err)
      })
  })

  // ----------------------content comment:----------------------
  const dataComment = (item, display = false) => {
    let actionValue = `<div class='rounded-circle btn-ellipsis'><i
                          class='fa-solid fa-ellipsis'
                        ></i>
                        <div class='menu-edit-comment'>
                          <ul>
                            <li><a
                                href='#modalEditComment'
                                class='edit-action'
                                data-toggle='modal'
                                data-idcomment='${item.id}'
                              ><i class='icofont icofont-edit'></i>
                                Edit</a></li>
                            <li><a href='#modalConfirmDeleteComment'
                                  class='delete-action'
                                  role='button'
                                  data-idcomment='${item.id}'
                                  data-toggle='modal'><i
                                  class='icofont icofont-garbage'
                                ></i>
                                Delete</a></li>
                          </ul>
                        </div>
                      </div>`
    let action = item.user.id === userLoginId ? actionValue : ''
    let avatarUrl = item.user.avatarUrl || '/img/user.png'

    return `<div class='mt-2 ${
      display === true ? 'showCommentOfUser' : 'commentOfUser'
    }' data-wrapcomment='${item.id}'>
              <div class='d-flex flex-row p-3'>
                <img
                src='${avatarUrl}'
                class='rounded-circle mr-3 img-avatar'
                />
                <div class='w-100'>
                  <div
                  class='d-flex justify-content-between align-items-center'
                  >
                    <div class='d-flex flex-row align-items-center'>
                    <span class='nameOfUser'>${item.user.fullName}</span>
                    <small class='ml-3'>${moment(new Date(item.createdAt))
                      .startOf('second')
                      .fromNow()}</small>
                    </div>
                    ${action}
                  </div>
                  <p
                  class='text-justify comment-text mb-0'
                  data-contentcomment='${item.id}'
                  >${item.comment}</p>
                </div>
              </div>
            </div>`
  }

  //----------------------ajax loadMore:----------------------
  let countPage
  $('#loadMore').on('click', async function (e) {
    e.preventDefault()
    $.ajax({
      url: `/api/movies/${movieId}/info`,
      type: 'GET',
    }).done((data) => {
      countPage = data.data.countComments / 10
    })

    await $.ajax({
      url: `/api/movies/${movieId}/comments?page=${pageNo + 1}`,
      type: 'GET',
    }).done((data) => {
      pageNo++
      let dataComments = data.data
        .map((item) => dataComment(item, false))
        .join('')
      let content = $('.commentOfUser-wrap').html()
      $('.commentOfUser-wrap').html(content + dataComments)
      $('.commentOfUser:hidden').slice(0, skipPage).slideDown()

      if (pageNo > countPage) {
        $('#loadMore').hide()
      }
    })
  })

  // ----------------------get comment :----------------------
  let comment_id
  $('#modalEditComment').on('show.bs.modal', function (event) {
    let button = $(event.relatedTarget)
    let id = button.data('idcomment')
    comment_id = id

    $.ajax({
      url: `/api/users/comments/${comment_id}`,
      type: 'GET',
    })
      .done((data) => {
        $('#editCommentMsg').val(`${data.data.comment}`)
      })
      .fail((err) => console.log(err))
  })

  // ----------------------update comment: ----------------------
  $('#saveEditComment').on('click', function (e) {
    e.preventDefault()
    let oldComment = $(`[data-contentcomment='${comment_id}']`).text()
    if (!$('#editCommentMsg').val().trim()) {
      toast({
        title: 'Warning',
        message: 'You should type something before send comments!',
        type: 'warning',
        duration: 3000,
      })
      return
    }
    let commentMsg = {
      comment: $('#editCommentMsg').val().trim(),
    }
    if (commentMsg.comment === oldComment) {
      toast({
        title: 'Warning',
        message: 'No something changed before send comments!',
        type: 'warning',
        duration: 3000,
      })
      return
    }

    $.ajax({
      url: `/api/users/comments/${comment_id}`,
      type: 'PUT',
      data: JSON.stringify(commentMsg),
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
    }).done(() => {
      toast({
        title: 'Success',
        message: 'You was editing your comment!',
        type: 'success',
        duration: 3000,
      })
      $('#modalEditComment').modal('hide')
      $(`[data-contentcomment='${comment_id}']`).text(`${commentMsg.comment}`)
    })
  })
  // ----------------------delete comment: ----------------------
  $('#modalConfirmDeleteComment').on('show.bs.modal', function (event) {
    let button = $(event.relatedTarget)
    let id = button.data('idcomment')
    comment_id = id
  })

  $('#btn-confirmDelete').on('click', function (e) {
    e.preventDefault()

    $.ajax({
      url: `/api/users/comments/${comment_id}`,
      type: 'DELETE',
    })
      .done(() => {
        toast({
          title: 'Success',
          message: 'You have already deleted this movie !',
          type: 'success',
          duration: 3000,
        })
        $('#modalConfirmDeleteComment').modal('hide')
        $(`[data-wrapcomment='${comment_id}']`).hide()
        getTotalCommentAndRating()
      })
      .fail((err) => {
        console.log(err)
      })
  })
  //---------------------- create comments:----------------------
  $('#comment-text').keypress(function (e) {
    if (e.key === 'Enter') {
      e.preventDefault()
      $('#submit-comment').click()
    }
  })

  $('#submit-comment').on('click', function (e) {
    e.preventDefault()
    if (!userLoginId) {
      toast({
        title: 'Error',
        message: 'You must login to do this action!',
        type: 'error',
        duration: 3000,
      })
      return
    }
    let commentMsg = $('#comment-text').val().trim()
    if (!commentMsg) {
      toast({
        title: 'Warning',
        message: 'You should type something before send comments!',
        type: 'warning',
        duration: 3000,
      })
      return
    }
    let commentData = {
      comment: commentMsg,
      movie_id: +movieId,
    }

    $.ajax({
      url: '/api/users/comments',
      type: 'POST',
      data: JSON.stringify(commentData),
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
    })
      .done((data) => {
        toast({
          title: 'Success',
          message: 'You have already commented this movie!',
          type: 'success',
          duration: 3000,
        })
        getTotalCommentAndRating()
        let newData = dataComment(data.data, true)
        const listCommentsElement = $('.commentOfUser-wrap')
        let allComments = listCommentsElement.html()
        listCommentsElement.html(`${newData}${allComments}`)
        $('#comment-text').val('')
      })
      .fail((err) => {
        console.log(err)
      })
  })
})
