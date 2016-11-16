Engine.define("Profile", function () {
    var Profile = {
        path: '/solar',
        fps: 50
    };
    Profile.speed = (24 * Profile.fps) * 60 * 24 * 365
    return Profile;
});