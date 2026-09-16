FROM node:22-alpine

WORKDIR /app

# התקנת התלויות תחילה לניצול ה-Cache של Docker
COPY package*.json ./
RUN npm install

# העתקת שאר קוד המקור
COPY . .

# חשיפת הפורט של השרת
EXPOSE 5000

CMD ["npm", "start"]