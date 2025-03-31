# Paragon
A Game Server Management Panel Without Docker

> **Development in Progress**

---

## Installation

### Prerequisites
- Ensure you have [Node.js and NPM](https://github.com/nvm-sh/nvm) installed on your system.

### Steps

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/shithost/paragon.git
   cd paragon
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Create a User (Optional):**
   ```bash
   node CreateUser.js
   ```

4. **Start the Server:**
   - **Foreground:**
     ```bash
     node .
     ```
   - **Background:**
     - First, install PM2 globally:
       ```bash
       npm install -g pm2
       ```
     - Then, start Paragon using PM2:
       ```bash
       pm2 start index.js
       ```