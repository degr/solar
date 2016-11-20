Engine.define("Profile", function () {
    var Profile = {
        path: '/solar',
        fps: 50
    };
    Profile.interval = 1000 / Profile.fps;
    Profile.speed = Profile.fps * 60 * 60 * 24 * 365;//speed for planets angle calculation

    return Profile;
});