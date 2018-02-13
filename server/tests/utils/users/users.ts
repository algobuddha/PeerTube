import { isAbsolute, join } from 'path'
import * as request from 'supertest'
import { makePostBodyRequest, makeUploadRequest, makePutBodyRequest } from '../'

import { UserRole } from '../../../../shared/index'

function createUser (
  url: string,
  accessToken: string,
  username: string,
  password: string,
  videoQuota = 1000000,
  role: UserRole = UserRole.USER,
  specialStatus = 200
) {
  const path = '/api/v1/users'
  const body = {
    username,
    password,
    role,
    email: username + '@example.com',
    videoQuota
  }

  return request(url)
          .post(path)
          .set('Accept', 'application/json')
          .set('Authorization', 'Bearer ' + accessToken)
          .send(body)
          .expect(specialStatus)
}

function registerUser (url: string, username: string, password: string, specialStatus = 204) {
  const path = '/api/v1/users/register'
  const body = {
    username,
    password,
    email: username + '@example.com'
  }

  return request(url)
          .post(path)
          .set('Accept', 'application/json')
          .send(body)
          .expect(specialStatus)
}

function getMyUserInformation (url: string, accessToken: string, specialStatus = 200) {
  const path = '/api/v1/users/me'

  return request(url)
          .get(path)
          .set('Accept', 'application/json')
          .set('Authorization', 'Bearer ' + accessToken)
          .expect(specialStatus)
          .expect('Content-Type', /json/)
}

function getMyUserVideoQuotaUsed (url: string, accessToken: string, specialStatus = 200) {
  const path = '/api/v1/users/me/video-quota-used'

  return request(url)
          .get(path)
          .set('Accept', 'application/json')
          .set('Authorization', 'Bearer ' + accessToken)
          .expect(specialStatus)
          .expect('Content-Type', /json/)
}

function getUserInformation (url: string, accessToken: string, userId: number) {
  const path = '/api/v1/users/' + userId

  return request(url)
    .get(path)
    .set('Accept', 'application/json')
    .set('Authorization', 'Bearer ' + accessToken)
    .expect(200)
    .expect('Content-Type', /json/)
}

function getMyUserVideoRating (url: string, accessToken: string, videoId: number | string, specialStatus = 200) {
  const path = '/api/v1/users/me/videos/' + videoId + '/rating'

  return request(url)
          .get(path)
          .set('Accept', 'application/json')
          .set('Authorization', 'Bearer ' + accessToken)
          .expect(specialStatus)
          .expect('Content-Type', /json/)
}

function getUsersList (url: string, accessToken: string) {
  const path = '/api/v1/users'

  return request(url)
          .get(path)
          .set('Accept', 'application/json')
          .set('Authorization', 'Bearer ' + accessToken)
          .expect(200)
          .expect('Content-Type', /json/)
}

function getUsersListPaginationAndSort (url: string, accessToken: string, start: number, count: number, sort: string) {
  const path = '/api/v1/users'

  return request(url)
          .get(path)
          .query({ start })
          .query({ count })
          .query({ sort })
          .set('Accept', 'application/json')
          .set('Authorization', 'Bearer ' + accessToken)
          .expect(200)
          .expect('Content-Type', /json/)
}

function removeUser (url: string, userId: number | string, accessToken: string, expectedStatus = 204) {
  const path = '/api/v1/users'

  return request(url)
          .delete(path + '/' + userId)
          .set('Accept', 'application/json')
          .set('Authorization', 'Bearer ' + accessToken)
          .expect(expectedStatus)
}

function updateMyUser (options: {
  url: string
  accessToken: string,
  newPassword?: string,
  displayNSFW?: boolean,
  email?: string,
  autoPlayVideo?: boolean
}) {
  const path = '/api/v1/users/me'

  const toSend = {}
  if (options.newPassword !== undefined && options.newPassword !== null) toSend['password'] = options.newPassword
  if (options.displayNSFW !== undefined && options.displayNSFW !== null) toSend['displayNSFW'] = options.displayNSFW
  if (options.autoPlayVideo !== undefined && options.autoPlayVideo !== null) toSend['autoPlayVideo'] = options.autoPlayVideo
  if (options.email !== undefined && options.email !== null) toSend['email'] = options.email

  return makePutBodyRequest({
    url: options.url,
    path,
    token: options.accessToken,
    fields: toSend,
    statusCodeExpected: 204
  })
}

function updateMyAvatar (options: {
  url: string,
  accessToken: string,
  fixture: string
}) {
  const path = '/api/v1/users/me/avatar/pick'
  let filePath = ''
  if (isAbsolute(options.fixture)) {
    filePath = options.fixture
  } else {
    filePath = join(__dirname, '..', '..', 'api', 'fixtures', options.fixture)
  }

  return makeUploadRequest({
    url: options.url,
    path,
    token: options.accessToken,
    fields: {},
    attaches: { avatarfile: filePath },
    statusCodeExpected: 200
  })
}

function updateUser (options: {
  url: string
  userId: number,
  accessToken: string,
  email?: string,
  videoQuota?: number,
  role?: UserRole
}) {
  const path = '/api/v1/users/' + options.userId

  const toSend = {}
  if (options.email !== undefined && options.email !== null) toSend['email'] = options.email
  if (options.videoQuota !== undefined && options.videoQuota !== null) toSend['videoQuota'] = options.videoQuota
  if (options.role !== undefined && options.role !== null) toSend['role'] = options.role

  return makePutBodyRequest({
    url: options.url,
    path,
    token: options.accessToken,
    fields: toSend,
    statusCodeExpected: 204
  })
}

function askResetPassword (url: string, email: string) {
  const path = '/api/v1/users/ask-reset-password'

  return makePostBodyRequest({
    url,
    path,
    fields: { email },
    statusCodeExpected: 204
  })
}

function resetPassword (url: string, userId: number, verificationString: string, password: string, statusCodeExpected = 204) {
  const path = '/api/v1/users/' + userId + '/reset-password'

  return makePostBodyRequest({
    url,
    path,
    fields: { password, verificationString },
    statusCodeExpected
  })
}

// ---------------------------------------------------------------------------

export {
  createUser,
  registerUser,
  getMyUserInformation,
  getMyUserVideoRating,
  getMyUserVideoQuotaUsed,
  getUsersList,
  getUsersListPaginationAndSort,
  removeUser,
  updateUser,
  updateMyUser,
  getUserInformation,
  askResetPassword,
  resetPassword,
  updateMyAvatar
}
