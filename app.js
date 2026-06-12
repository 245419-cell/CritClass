require('dotenv').config();
const express = require('express');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const bcrypt = require('bcrypt');

const app = express();
const PORT = process.env.PORT || 3000;
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;

const db = new sqlite3.Database(path.join(__dirname, 'database.sqlite'));

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE,
      passwordHash TEXT,
      googleId TEXT UNIQUE,
      displayName TEXT
    )
  `);
});

// create and seed sections table (teachers / courses)
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS sections (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      teacherFirstName TEXT,
      teacherLastName TEXT,
      courseName TEXT
    )
  `);

  const sections = [
    ["Laurie","Medeiros","Early Graduation"],
    ["Janice","Tevanian","TOPS SOPO"],
    ["Laurie","Medeiros","SPED Services ONLY"],
    ["Susan","Andersen","ML Foundational Lit IntP1"],
    ["Brian","Olson","Independent Study"],
    ["HEIDI","CAMERON","Independent Study"],
    ["JAMIE","ROMANO","Independent Study"],
    ["Jonathan","Graffius","Independent Study"],
    ["Joseph","Foley","Independent Study"],
    ["Margaret","Hoyt","Independent Study"],
    ["Mary","Nance","Independent Study"],
    ["Talya","Davis","Independent Study"],
    ["Corene Dee","Wickenheiser","CONSUMER MATH"],
    ["Maria","Curit","JMG 2"],
    ["Maria","Curit","JMG 1"],
    ["Melanie","Moran","JMG SCHOOL TO WORK"],
    ["Tracey","Menard","AEP HUMANITIES"],
    ["Brian","Olson","AEP STEM"],
    ["Brian","Olson","AEP WELLNESS"],
    ["Tracey","Menard","AEP WELLNESS"],
    ["Tracey","Menard","AEP ART"],
    ["Emily","Serway","ADAPTIVE ART"],
    ["Emily","Serway","CLAY/CERAMICS II"],
    ["Chad","Hart","ART I FOUND"],
    ["Kathryn","Carlisle","ART I FOUND"],
    ["Emily","Serway","CLAY/CERAMICS I"],
    ["Alexander","Laumeister","ADVISORY 11"],
    ["ANDREW","PISANI","ADVISORY 11"],
    ["Armando","Monge","ADVISORY 11"],
    ["Bridget","DePaola","ADVISORY 11"],
    ["Christine","Boudreau","ADVISORY 11"],
    ["Cyle","Davenport","ADVISORY 11"],
    ["Erin","Benson","ADVISORY 11"],
    ["KATHLEEN","COSTELLO","ADVISORY 11"],
    ["Kenga","Dilamini","ADVISORY 11"],
    ["Margaret","Callaghan","ADVISORY 11"],
    ["Maria","Curit","ADVISORY 11"],
    ["Solomon","Nkhalamba","ADVISORY 11"],
    ["Brendan","Scully","ADVISORY 10"],
    ["Carina","Spiro","ADVISORY 10"],
    ["David","Brooks","ADVISORY 10"],
    ["Joel","Lesinski","ADVISORY 10"],
    ["Jonathan","Graffius","ADVISORY 10"],
    ["Joseph","Forsyth","ADVISORY 10"],
    ["Kathryn","Carlisle","ADVISORY 10"],
    ["Kathryn","Hogan","ADVISORY 10"],
    ["Mary","Nance","ADVISORY 10"],
    ["Patrick","Williams","ADVISORY 10"],
    ["Sarah","York","ADVISORY 10"],
    ["Scott","Patterson","ADVISORY 10"],
    ["Susan","Andersen","ADVISORY 10"],
    ["Tracey","Menard","ADVISORY 10"],
    ["Andrew","Miller","ADVISORY 9"],
    ["Halima","Noor","ADVISORY 9"],
    ["Juman","Hussein","ADVISORY 9"],
    ["Katie","Flavin","ADVISORY 9"],
    ["Khadar","Ibrahim","ADVISORY 9"],
    ["Kristin","Leffler","ADVISORY 9"],
    ["Lily","Withington","ADVISORY 9"],
    ["Rebecca","Cohen","ADVISORY 9"],
    ["Reva","Eiferman","ADVISORY 9"],
    ["Ryan","Hutchins","ADVISORY 9"],
    ["Tyler","Jellison","ADVISORY 9"],
    ["Alexis","Kanamugire","ADVISORY 12"],
    ["Chad","Hart","ADVISORY 12"],
    ["Corene Dee","Wickenheiser","ADVISORY 12"],
    ["Darcie","Drew","ADVISORY 12"],
    ["Emily","Serway","ADVISORY 12"],
    ["HEIDI","CAMERON","ADVISORY 12"],
    ["JAMIE","ROMANO","ADVISORY 12"],
    ["JESSICA","BEAN","ADVISORY 12"],
    ["Kathleen","Hiscock","ADVISORY 12"],
    ["Lucy","Sommo","ADVISORY 12"],
    ["Mary","Wallace","ADVISORY 12"],
    ["MICHAEL","D'ANDREA","ADVISORY 12"],
    ["Nirmala","Young","ADVISORY 12"],
    ["Rebecca","Boggs","ADVISORY 12"],
    ["Stanley","Scontras","ADVISORY 12"],
    ["Talya","Davis","ADVISORY 12"],
    ["Ted","Gill","ADVISORY 12"],
    ["HEIDI","CAMERON","LANGUAGE ACQUISITION FOR SS 1"],
    ["Nathaniel","Gordon","ENGLISH FOR ELLS IIIA"],
    ["Lucy","Sommo","ENGLISH FOR ELLS IA"],
    ["Mary","Wallace","ENGLISH FOR ELLS IIA"],
    ["Lucy","Sommo","ENGLISH FOR ELLS IIB"],
    ["Mary","Wallace","ENGLISH FOR ELLS IIIB"],
    ["Mark","Poirier","LANGUAGE ACQUISITION FOR MATH"],
    ["HEIDI","CAMERON","LANGUAGE ACQUISITION FOR SCI 1"],
    ["Margaret","Callaghan","ACADEMIC LANG"],
    ["Tyler","Jellison","ML Human Geography"],
    ["Kathleen","Hiscock","ML FOUNDATIONAL LIT P1"],
    ["Susan","Andersen","ML FOUNDATIONAL LIT IntP2"],
    ["Kathleen","Hiscock","ML Foundational Lit P2"],
    ["Ryan","Hutchins","SPANISH IV (H)"],
    ["Armando","Monge","HERITAGE SPANISH"],
    ["Juman","Hussein","ARABIC II"],
    ["Alexis","Kanamugire","FRENCH I"],
    ["Juman","Hussein","ARABIC I"],
    ["Ryan","Hutchins","SPANISH II"],
    ["Reva","Eiferman","SPANISH III"],
    ["Alexis","Kanamugire","FRENCH II"],
    ["Alexis","Kanamugire","FRENCH III"],
    ["Reva","Eiferman","SPANISH I"],
    ["Ryan","Hutchins","SPANISH I"],
    ["Reva","Eiferman","SPANISH LANG &amp; CULTURE (AP)"],
    ["Alexis","Kanamugire","FRENCH IV (HR)"],
    ["Reva","Eiferman","SPANISH V (HR)"],
    ["Joseph","Forsyth","ENGLISH 1"],
    ["Meghan","Donnelly","ENGLISH 1"],
    ["David","Brooks","STANDARD SUPPORT FOR ENGLISH"],
    ["KATHLEEN","COSTELLO","STANDARD SUPPORT FOR ENGLISH"],
    ["Patrick","Williams","CREATIVE WRITING"],
    ["David","Brooks","ENGLISH LANG &amp; COMP (AP)"],
    ["KATHLEEN","COSTELLO","ENGLISH 2"],
    ["Erin","Benson","ENGLISH LIT &amp; COMP (AP)"],
    ["JAMIE","ROMANO","ENGLISH 4"],
    ["Patrick","Williams","ENGLISH 4"],
    ["Patrick","Williams","DOCUMENTARY FILM STUDIES"],
    ["David","Brooks","ENGLISH 3"],
    ["Erin","Benson","ENGLISH 3"],
    ["JAMIE","ROMANO","ENGLISH 3"],
    ["Erin","Benson","Pre-AP English 2"],
    ["Solomon","Nkhalamba","Data Science"],
    ["Mark","Poirier","ALGEBRA 1B"],
    ["Scott","Patterson","ALGEBRA 1B"],
    ["Stanley","Scontras","CALCULUS A (DE)"],
    ["Khadar","Ibrahim","ALGEBRA 1A"],
    ["Scott","Patterson","ALGEBRA 1A"],
    ["Mark","Poirier","ML Pre-Algebra"],
    ["Khadar","Ibrahim","ALGEBRA I"],
    ["Lily","Withington","ALGEBRA I"],
    ["Rebecca","Cohen","ALGEBRA I"],
    ["Christine","Boudreau","QUANTITATIVE REASONING"],
    ["Rebecca","Cohen","CALCULUS BC (AP part 2)"],
    ["Jeffrey","Borland","STATISTICS (AP)"],
    ["Solomon","Nkhalamba","ACCELERATED MATH II"],
    ["HEIDI","CAMERON","PERSONAL FINANCE"],
    ["Carina","Spiro","GEOMETRY"],
    ["Christine","Boudreau","GEOMETRY"],
    ["Robert","Lansing","GEOMETRY"],
    ["Christine","Boudreau","ACCELERATED MATH I"],
    ["Kenga","Dilamini","ALGEBRA II (HR)"],
    ["Solomon","Nkhalamba","ALGEBRA II (HR)"],
    ["Mark","Poirier","ALGEBRA II"],
    ["Robert","Lansing","ALGEBRA II"],
    ["Solomon","Nkhalamba","ALGEBRA II"],
    ["Stanley","Scontras","ALGEBRA II"],
    ["Kenga","Dilamini","PRECALCULUS (HR)"],
    ["Rebecca","Cohen","CALCULUS BC (AP part 1)"],
    ["Carina","Spiro","GEOMETRY (HR)"],
    ["Kenga","Dilamini","ACC PRECALCULUS  (HR-PRE AP)"],
    ["AUDREY","CABRAL","ORCHESTRA (HR)"],
    ["AUDREY","CABRAL","ORCHESTRA"],
    ["Abby","Hutchins","INTRO TO GUITAR &amp; PIANO"],
    ["Bridget","DePaola","INTRO TO GUITAR &amp; PIANO"],
    ["Bridget","DePaola","BAND"],
    ["Abby","Hutchins","CHORUS"],
    ["Bridget","DePaola","INTRO TO DIGITAL MUSIC"],
    ["Abby","Hutchins","ADAPTIVE MUSIC"],
    ["Talya","Davis","BIOLOGY (AP part 1)"],
    ["Brendan","Scully","CHEMISTRY"],
    ["Brendan","Scully","CHEMISTRY (HR)"],
    ["Cyle","Davenport","CHEMISTRY (HR)"],
    ["Andrew","Miller","PHYSICS"],
    ["Nirmala","Young","BIOLOGY"],
    ["Sarah","York","BIOLOGY"],
    ["Talya","Davis","BIOLOGY"],
    ["Nirmala","Young","BIOLOGY (HR)"],
    ["Sarah","York","BIOLOGY (HR)"],
    ["Talya","Davis","BIOLOGY (HR)"],
    ["Katie","Flavin","MARINE ECOLOGY"],
    ["Sarah","York","ANATOMY &amp; PHYSIOLOGY (HR)"],
    ["Heather","Sawyer","FORENSIC SCIENCE"],
    ["Brendan","Scully","ENGINEERING &amp; DESIGN"],
    ["Heather","Sawyer","ENGINEERING &amp; DESIGN"],
    ["Andrew","Miller","PHYSICS (HR)"],
    ["Cyle","Davenport","CHEMISTRY (AP)"],
    ["Cyle","Davenport","PHYSICS (AP)"],
    ["Talya","Davis","BIOLOGY (AP part 2)"],
    ["Andrew","Miller","ENVIRONMENTAL SCIENCE"],
    ["Katie","Flavin","ENVIRONMENTAL SCIENCE"],
    ["Nirmala","Young","ENVIRONMENTAL SCIENCE"],
    ["Kathryn","Hogan","ML Environmental Science"],
    ["Nirmala","Young","ML Environmental Science"],
    ["Talya","Davis","ML Biology"],
    ["Darcie","Drew","AP US Government &amp; Politics"],
    ["Lucy","Sommo","ML Government &amp; Politics"],
    ["Darcie","Drew","US HISTORY (AP) part 1"],
    ["Joel","Lesinski","US HISTORY (AP) part 1"],
    ["Kristin","Leffler","HUMAN GEOGRAPHY (AP)"],
    ["Tyler","Jellison","HUMAN GEOGRAPHY (AP)"],
    ["JESSICA","BEAN","PSYCHOLOGY"],
    ["JESSICA","BEAN","PSYCHOLOGY (AP)"],
    ["Joseph","Forsyth","EARLY US HISTORY"],
    ["Darcie","Drew","US HISTORY (AP) part 2"],
    ["Joel","Lesinski","US HISTORY (AP) part 2"],
    ["Darcie","Drew","The US &amp; MODERN WORLD"],
    ["JESSICA","BEAN","The US &amp; MODERN WORLD"],
    ["Joel","Lesinski","The US &amp; MODERN WORLD"],
    ["Mary","Nance","The US &amp; MODERN WORLD"],
    ["Mary","Nance","ECONOMICS"],
    ["Halima","Noor","GLOBAL ISSUES"],
    ["Kristin","Leffler","GLOBAL ISSUES"],
    ["Janet","Pipkin","FUNCTIONAL LITERACY"],
    ["Margaret","Hoyt","FUNCTIONAL MATH IB"],
    ["Jessica","Muldoon","PRACTICAL HUMANITIES A"],
    ["Rebecca","Boggs","LIFE SKILLS STEM"],
    ["Rebecca","Boggs","LIFE SKILLS CAREER EXPLORATION"],
    ["Rebecca","Boggs","LIFE SKILLS MATH"],
    ["Rebecca","Boggs","FLS SOCIAL STUDIES &amp; LITERACY"],
    ["Alfred","Gillis","LEARNING LAB"],
    ["Anne","Bischof","LEARNING LAB"],
    ["Corene Dee","Wickenheiser","LEARNING LAB"],
    ["Janet","Pipkin","LEARNING LAB"],
    ["Jessica","Muldoon","LEARNING LAB"],
    ["Katherine","Gray","LEARNING LAB"],
    ["Margaret","Hoyt","LEARNING LAB"],
    ["Joseph","Foley","BREATHE SUPPORT LAB"],
    ["Margaret","Hoyt","FUNCTIONAL MATH IA"],
    ["Margaret","Hoyt","FUNCTIONAL MATH IIA"],
    ["Janet","Pipkin","Functional Literacy"],
    ["Janet","Pipkin","Literacy Development"],
    ["Anne","Bischof","PRACTICAL MATH A"],
    ["Jessica","Muldoon","PRACTICAL MATH A"],
    ["Margaret","Hoyt","FUNCTIONAL SCIENCE"],
    ["Janet","Pipkin","FA USH 20th Century"],
    ["Janet","Pipkin","Literacy Development"],
    ["Jeffrey","Borland","COMPUTER SCIENCE (AP)"],
    ["Jonathan","Graffius","Computer Science Principles"],
    ["Jonathan","Graffius","Computer Science Fundamentals"],
    ["Jonathan","Graffius","Digital Imaging &amp; Editing"],
    ["Alexander","Laumeister","PHYSICAL  EDUCATION"],
    ["ANDREW","PISANI","PHYSICAL  EDUCATION"],
    ["MICHAEL","D'ANDREA","PHYSICAL  EDUCATION"],
    ["Alexander","Laumeister","HEALTH"],
    ["MICHAEL","D'ANDREA","UNIFIED PHYSICAL EDUCATION"],
    ["ANDREW","PISANI","UNIFIED PE LEADERSHIP"],
    ["MICHAEL","D'ANDREA","UNIFIED PE LEADERSHIP"],
    ["Mary","Nance","AP World History: Modern"],
    ["ANDREW","PISANI","Personal Fitness"],
    ["MICHAEL","D'ANDREA","Personal Fitness"],
    ["Chad","Hart","Drawing &amp; Painting"],
    ["Kathryn","Carlisle","Sculpture/3D Design"],
    ["Kathryn","Carlisle","Advanced Art"],
    ["Margaret","Hoyt","FUNCTIONAL HEALTH"],
    ["Ted","Gill","AEP SUPPORT"],
    ["HEIDI","CAMERON","Directed Study Hall"],
    ["Melanie","Moran","Directed Study Hall"],
    ["Brendan","Scully","ENGINEERING &amp; DESIGN II"],
    ["Heather","Sawyer","ENGINEERING &amp; DESIGN II"],
    ["Susan","Andersen","Foundational Lit-Co Taught"],
    ["Susan","Andersen","Foundational Lit-Co Taught P2"],
    ["Juman","Hussein","World Cultures"],
    ["Mary","Nance","Social Studies Standard Suppor"],
    ["Corene Dee","Wickenheiser","Digital Citizenship"],
    ["Corene Dee","Wickenheiser","Voc/Ind Living Skills"],
    ["Corene Dee","Wickenheiser","Transition Portfolio"],
    ["Halima","Noor","African American History (HR)"],
    ["Kristin","Leffler","Journalism and Society"],
    ["Brendan","Scully","Teacher Assistant"],
    ["Carina","Spiro","Teacher Assistant"],
    ["Darcie","Drew","Teacher Assistant"],
    ["Emily","Serway","Teacher Assistant"],
    ["Halima","Noor","Teacher Assistant"],
    ["Heather","Sawyer","Teacher Assistant"],
    ["Janet","Pipkin","Teacher Assistant"],
    ["Joseph","Foley","Teacher Assistant"],
    ["Juman","Hussein","Teacher Assistant"],
    ["Katie","Flavin","Teacher Assistant"],
    ["Kristin","Leffler","Teacher Assistant"],
    ["Maria","Curit","Teacher Assistant"],
    ["Meghan","Donnelly","Teacher Assistant"],
    ["Nirmala","Young","Teacher Assistant"],
    ["Reva","Eiferman","Teacher Assistant"],
    ["Sarah","York","Teacher Assistant"],
    ["Tyler","Jellison","Teacher Assistant"],
    ["Lily","Withington","Standard Support for Math"]
  ];

  db.get('SELECT COUNT(*) as cnt FROM sections', (err, row) => {
    if (err) return;
    if (row && row.cnt === 0) {
      const stmt = db.prepare('INSERT INTO sections (teacherFirstName, teacherLastName, courseName) VALUES (?,?,?)');
      sections.forEach(s => stmt.run(s));
      stmt.finalize();
    }
  });
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'replace-this-with-a-secret',
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  db.get('SELECT id, email, displayName FROM users WHERE id = ?', [id], (err, user) => {
    done(err, user);
  });
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      callbackURL: `${BASE_URL}/auth/google/callback`,
    },
    (accessToken, refreshToken, profile, done) => {
      const email = profile.emails && profile.emails[0] ? profile.emails[0].value : null;
      const displayName = profile.displayName || email || 'Google User';

      db.get('SELECT * FROM users WHERE googleId = ? OR email = ?', [profile.id, email], (err, existingUser) => {
        if (err) {
          return done(err);
        }

        if (existingUser) {
          if (!existingUser.googleId) {
            db.run('UPDATE users SET googleId = ?, displayName = ? WHERE id = ?', [profile.id, displayName, existingUser.id]);
          }
          return done(null, existingUser);
        }

        db.run(
          'INSERT INTO users (email, googleId, displayName) VALUES (?, ?, ?)',
          [email, profile.id, displayName],
          function (insertErr) {
            if (insertErr) {
              return done(insertErr);
            }
            db.get('SELECT id, email, displayName FROM users WHERE id = ?', [this.lastID], (fetchErr, user) => {
              return done(fetchErr, user);
            });
          }
        );
      });
    }
  )
);

function requireAuth(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/?message=Please+sign+in+to+continue');
}

app.get('/', (req, res) => {
  res.render('index', {
    user: req.user,
    message: req.query.message || null,
  });
});

app.post('/signup', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.redirect('/?message=Enter+an+email+and+password');
  }

  const passwordHash = await bcrypt.hash(password, 10);
  db.get('SELECT * FROM users WHERE email = ?', [email], (err, existingUser) => {
    if (err) {
      return res.redirect('/?message=Database+error');
    }
    if (existingUser) {
      return res.redirect('/?message=Email+already+registered');
    }

    db.run('INSERT INTO users (email, passwordHash, displayName) VALUES (?, ?, ?)', [email, passwordHash, email], function (insertErr) {
      if (insertErr) {
        return res.redirect('/?message=Unable+to+create+account');
      }
      req.login({ id: this.lastID }, (loginErr) => {
        if (loginErr) {
          return res.redirect('/?message=Unable+to+log+in+after+sign+up');
        }
        return res.redirect('/home');
      });
    });
  });
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.redirect('/?message=Enter+an+email+and+password');
  }

  db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
    if (err || !user) {
      return res.redirect('/?message=Invalid+email+or+password');
    }
    if (!user.passwordHash) {
      return res.redirect('/?message=Use+Google+sign-in+for+this+account');
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return res.redirect('/?message=Invalid+email+or+password');
    }

    req.login(user, (loginErr) => {
      if (loginErr) {
        return res.redirect('/?message=Unable+to+log+in');
      }
      return res.redirect('/home');
    });
  });
});

app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get(
  '/auth/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/?message=Google+sign+in+failed',
  }),
  (req, res) => {
    res.redirect('/home');
  }
);

app.get('/home', requireAuth, (req, res) => {
  res.render('home', {
    user: req.user,
  });
});

app.get('/dashboard', requireAuth, (req, res) => {
  res.render('dashboard', {
    user: req.user,
  });
});

app.get('/logout', (req, res) => {
  req.logout(() => {
    res.redirect('/');
  });
});

app.listen(PORT, () => {
  console.log(`Server running on ${BASE_URL}`);
});
