import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

// Import icon sets
import { fas } from "@fortawesome/free-solid-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { faGoogle, faGithub } from "@fortawesome/free-brands-svg-icons";

// Add icons to the library

library.add(fas, far, fab);
library.add();
library.add(faGoogle, faGithub);

export default FontAwesomeIcon;
