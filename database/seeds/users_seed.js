/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = function (knex) {
  // delete all existing entries
  return knex('users').del()
    .then(function () {
      // insert seed entries
      return knex('users').insert([
        { username: 'user1', password: 'password1' },
        { username: 'user2', password: 'password2' },
        // etc...
      ]);
    });
};