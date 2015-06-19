/* 
Arduino code by LangChuan Huang
2015-06-13 Hackathon Taiwan
Connect three LED (+) pin to Arduino pin 8 9 10 , LED (-) pin connect resistor to GND
*/

char input[8];
int n = 0;

void setup()
{
  Serial.begin(9600);
  pinMode(8, OUTPUT);
  pinMode(9, OUTPUT);
  pinMode(10, OUTPUT);
}

void loop() 
{
  if (Serial.available() > 0)
  {
    if(n == 0)
    {
      input[0] = Serial.read();
      n++;
    }
    else
    {
      input[n] = Serial.read();
      if(input[n] == 'Z')
      {
        int time = 0;
        for(int i = 1; i < n; i++)
        {
          time += (input[i] - '0') * pow(10, n - i - 1);
        }
        if(input[0] == 'A') 
        {
          digitalWrite(8, HIGH);
          delay(time);
          digitalWrite(8, LOW);
        }
        else if(input[0] == 'B')
        {
          digitalWrite(9, HIGH);
          delay(time);
          digitalWrite(9, LOW);
        }
        else if(input[0] == 'C')
        {
          digitalWrite(10, HIGH);
          delay(time);
          digitalWrite(10, LOW);
        }
        n = 0;
      }
      else n++;
    }
  }
}









