import React, { Component } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import * as d3 from 'd3';
import NumberFormat from 'react-number-format';

class SentimentResults extends Component {
  render() {
    var data = this.props.data;
    var summary = this.props.summary;

    if (!data.length) {
      return <div></div>
    }

    var urlParts = this.props.url.split('?');
    var url = urlParts[0] + '/csv?' + urlParts[1];

    var vaderScale = d3.scaleLinear().domain([-1,1]);

    var vaderHistogram = d3.histogram()
        .value(function(d) { return d.vader_sentiment.compound; })
        .domain(vaderScale.domain())
        .thresholds(vaderScale.ticks(10));

    var vaderBins = vaderHistogram(data);

    var vaderHist = vaderBins.map( bin => {
      var count = bin.length;
      return {
        'count': count,
        'min': bin.x0,
        'max': bin.x1
      }
    });

    var afinnScale = d3.scaleLinear().domain([-10,10]);

    var afinnHistogram = d3.histogram()
        .value(function(d) { return d.afinn_sentiment; })
        .domain(afinnScale.domain())
        .thresholds(afinnScale.ticks(10));

    var afinnBins = afinnHistogram(data);

    var afinnHist = afinnBins.map( bin => {
      var count = bin.length;
      return {
        'count': count,
        'min': bin.x0,
        'max': bin.x1
      }
    });


    return (
      <div>
        <div className="row">
          <div className="chartContainer six columns">
            <h2>VADER Compound Distribution</h2>
            <p>
              Median: <NumberFormat value={summary.vader.median} displayType={'text'} fixedDecimalScale={true} decimalScale={3} /> | Avg: <NumberFormat value={summary.vader.mean} displayType={'text'} fixedDecimalScale={true} decimalScale={3} />
            </p>
            <ResponsiveContainer aspect={2}>
              <BarChart data={vaderHist}>
                <XAxis dataKey="min"/>
                <YAxis domain={[0, 100]}/>
                <CartesianGrid strokeDasharray="3 3"/>
                <Tooltip/>
                <Bar dataKey="count" fill="#1eaedb" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="chartContainer six columns">
            <h2>AFINN Distribution</h2>
            <p>
              Median: <NumberFormat value={summary.afinn.median} displayType={'text'} fixedDecimalScale={true} decimalScale={3} /> | Avg: <NumberFormat value={summary.afinn.mean} displayType={'text'} fixedDecimalScale={true} decimalScale={3} />
            </p>
            <ResponsiveContainer aspect={2}>
              <BarChart data={afinnHist}>
                <XAxis dataKey="min"/>
                <YAxis domain={[0, 100]} />
                <CartesianGrid strokeDasharray="3 3"/>
                <Tooltip/>
                <Bar dataKey="count" fill="#1eaedb" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <p>Negative numbers are more negative, positive numbers are more positive.</p>
        </div>
        <div className="download">
          <div><a href={url}>Download CSV</a> or copy link below:</div>
          <div><input type="text" readOnly={true} value={url}/></div>
        </div>
        <div className="tweets">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Username</th>
                <th>Verified</th>
                <th>Text</th>
                <th>AFINN</th>
                <th>VADER compound</th>
                <th>VADER neu</th>
                <th>VADER pos</th>
                <th>VADER neg</th>
              </tr>
            </thead>
            <tbody>
            {
              data.map((tweet, index) => (
                <tr key={"container_" + index} className="tweet">
                  <td key={"id_" + index}>
                    <a href={"https://twitter.com/i/web/status/" + tweet.id_str} target="_blank">{tweet.id_str}</a>
                  </td>
                  <td key={"username_" + index}>
                    @{tweet.user.screen_name}
                  </td>
                  <td key={"verified_" + index}>
                    {tweet.user.verified ? 'true' : 'false'}
                  </td>
                  <td key={"text_" + index}>
                    {tweet.text}
                  </td>
                  <td className="numeric" key={"afinn_" + index}>
                    <NumberFormat value={tweet.afinn_sentiment} displayType={'text'} fixedDecimalScale={true} decimalScale={2} />
                  </td>
                  <td className="numeric" key={"vadercompound_" + index}>
                    <NumberFormat value={tweet.vader_sentiment.compound} displayType={'text'} fixedDecimalScale={true} decimalScale={2} />
                  </td>
                  <td className="numeric" key={"vaderneu_" + index}>
                    <NumberFormat value={tweet.vader_sentiment.neu} displayType={'text'} fixedDecimalScale={true} decimalScale={2} />
                  </td>
                  <td className="numeric" key={"vaderpos_" + index}>
                    <NumberFormat value={tweet.vader_sentiment.pos} displayType={'text'} fixedDecimalScale={true} decimalScale={2} />
                  </td>
                  <td className="numeric" key={"vaderneg_" + index}>
                    <NumberFormat value={tweet.vader_sentiment.neg} displayType={'text'} fixedDecimalScale={true} decimalScale={2} />
                  </td>
                </tr>
              ))
            }
            </tbody>
          </table>
        </div>
      </div>
    )
  }
}

export default SentimentResults;

